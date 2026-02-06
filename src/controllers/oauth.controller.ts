import { Request, Response } from "express";
import { OAuthService } from "../services/oauth.service";
import { prisma } from "../db/prisma";
import crypto from "crypto";

export class OAuthController {
  static async authorize(req: Request, res: Response) {
    const {
      response_type,
      client_id,
      redirect_uri,
      scope,
      state,
      code_challenge,
      code_challenge_method
    } = req.query as any;

    // 1. Validate response type
    if (response_type !== "code") {
      return res.status(400).json({ error: "Unsupported response_type" });
    }

    // 2. Validate client_id
    const client = await OAuthService.getClientById(client_id);
    if (!client) {
      return res.status(400).json({ error: "Invalid client_id" });
    }

    // 3. Validate redirect_uri
    if (!client.redirectUris.includes(redirect_uri)) {
      return res.status(400).json({ error: "Invalid redirect_uri" });
    }

    // 4. Validate scope
    // (We accept any scope for now; later we’ll map OAuthScope)
    const scopes = scope ? scope.split(" ") : [];

    // 5. Require login
    const sessionUserId = (req.session as any).userId;

    if (!sessionUserId) {
      return res.redirect(`/login?next=${encodeURIComponent(req.originalUrl)}`);
    }

    // 6. Render a minimal consent screen (we can improve later)
    return res.send(`
      <html>
        <head>
          <title>Authorize App</title>
          <style>
            body {
              background: #f4f6f8;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .card {
              background: white;
              padding: 30px;
              border-radius: 10px;
              width: 420px;
              box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 22px;
              font-weight: bold;
            }
            .app-name {
              font-size: 18px;
              margin: 10px 0 5px;
              font-weight: bold;
            }
            .scopes {
              margin-top: 10px;
              color: #555;
            }
            .actions {
              margin-top: 25px;
              display: flex;
              justify-content: space-between;
            }
            button {
              padding: 10px 22px;
              border: none;
              border-radius: 6px;
              font-size: 15px;
              cursor: pointer;
            }
            .allow {
              background: #4CAF50;
              color: white;
            }
            .deny {
              background: #e74c3c;
              color: white;
            }
            button:hover {
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">App Permissions Request</div>

            <div class="app-name">${client.name}</div>
            <div class="scopes">
              This app is requesting access to:<br/>
              <strong>${scopes.join(", ") || "No specific scopes"}</strong>
            </div>

            <form method="POST" action="/oauth/authorize/decision">
              <input type="hidden" name="client_id" value="${client_id}" />
              <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
              <input type="hidden" name="state" value="${state || ""}" />
              <input type="hidden" name="scope" value="${scope || ""}" />
              <input type="hidden" name="code_challenge" value="${code_challenge || ""}" />
              <input type="hidden" name="code_challenge_method" value="${code_challenge_method || ""}" />

              <div class="actions">
                <button class="deny" type="submit" name="decision" value="deny">Deny</button>
                <button class="allow" type="submit" name="decision" value="allow">Allow</button>
              </div>
            </form>
          </div>
        </body>
      </html>
    `);
  }

  static async authorizeDecision(req: Request, res: Response) {
    const {
      client_id,
      redirect_uri,
      state,
      scope,
      decision,
      code_challenge,
      code_challenge_method
    } = req.body;

    if (decision === "deny") {
      return res.redirect(`${redirect_uri}?error=access_denied&state=${state || ""}`);
    }

    const sessionUserId = (req.session as any).userId;

    if (!sessionUserId) {
      return res.status(401).json({ error: "login_required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId }
    });
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Generate authorization code
    const code = crypto.randomBytes(32).toString("hex");

    const client = await prisma.oAuthClient.findUnique({
      where: { clientId: client_id }
    });

    if (!client) {
      return res.status(400).json({ error: "Invalid client_id" });
    }

    await prisma.oAuthAuthorizationCode.create({
      data: {
        code,
        clientId: client.id,
        userId: sessionUserId,
        redirectUri: redirect_uri,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        codeChallenge: code_challenge || null,
        codeMethod: code_challenge_method || null,
      }
    });

    // Redirect back to the client
    return res.redirect(
      `${redirect_uri}?code=${code}${state ? `&state=${state}` : ""}`
    );
  }

  static async token(req: Request, res: Response) {
    const {
      grant_type,
      code,
      redirect_uri,
      client_id,
      client_secret,
      code_verifier,
      refresh_token
    } = req.body;

    // 1️⃣ Validate grant type
    if (["authorization_code", "refresh_token"].indexOf(grant_type) === -1) {
      return res.status(400).json({ error: "unsupported_grant_type" });
    }

    // 2️⃣ Find OAuth client by PUBLIC id (clientId) 
    const client = await prisma.oAuthClient.findUnique({
      where: { clientId: client_id },
    });

    if (!client) {
      return res.status(400).json({ error: "invalid_client" });
    }

    // 3️⃣ Validate client secret
    if (client.clientSecret !== client_secret) {
      return res.status(400).json({ error: "invalid_client_secret" });
    }

    if (grant_type === "authorization_code") {
      // 4️⃣ Fetch authorization code
      const authCode = await prisma.oAuthAuthorizationCode.findUnique({
        where: { code },
      });

      if (!authCode) {
        return res.status(400).json({ error: "invalid_code" });
      }

      // 5️⃣ Validate redirect URI
      if (authCode.redirectUri !== redirect_uri) {
        return res.status(400).json({ error: "redirect_uri_mismatch" });
      }

      // 6️⃣ Check expiration
      if (authCode.expiresAt < new Date()) {
        return res.status(400).json({ error: "expired_code" });
      }

      // 7️⃣ Validate PKCE (if used)
      if (authCode.codeChallenge) {
        if (!code_verifier) {
          return res.status(400).json({ error: "missing_code_verifier" });
        }

        const expectedChallenge = crypto
          .createHash("sha256")
          .update(code_verifier)
          .digest("base64url");

        if (expectedChallenge !== authCode.codeChallenge) {
          return res.status(400).json({ error: "invalid_code_verifier" });
        }
      }

      // 8️⃣ Generate access token
      const accessToken = crypto.randomBytes(32).toString("hex");

      await prisma.oAuthAccessToken.create({
        data: {
          token: accessToken,
          userId: authCode.userId,        // uses the real DB user ID
          clientId: client.id,            // uses OAuthClient.id (FK)
          scope: "",                      // optional, can add later
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // 9️⃣ Authorization code MUST be deleted (one-time use)
      await prisma.oAuthAuthorizationCode.delete({
        where: { code },
      });

      // Generate refresh token
      const refreshToken = crypto.randomBytes(40).toString("hex");

      await prisma.oAuthRefreshToken.create({
        data: {
          token: refreshToken,
          userId: authCode.userId,
          clientId: client.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      });

      // 🔟 Return OAuth2 standard token response
      return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 3600,
      });
    } else if (grant_type === "refresh_token") {
      if (!refresh_token) {
        return res.status(400).json({ error: "missing_refresh_token" });
      }

      const stored = await prisma.oAuthRefreshToken.findUnique({
        where: { token: refresh_token }
      });

      if (!stored || stored.expiresAt < new Date()) {
        return res.status(400).json({ error: "invalid_refresh_token" });
      }

      // Issue new access token
      const newAccessToken = crypto.randomBytes(32).toString("hex");

      await prisma.oAuthAccessToken.create({
        data: {
          token: newAccessToken,
          userId: stored.userId,
          clientId: stored.clientId,
          scope: "",
          expiresAt: new Date(Date.now() + 60 * 60 * 1000)
        },
      });

      // (Optional) rotate refresh tokens
      // For now, we reuse the old one.

      return res.json({
        access_token: newAccessToken,
        refresh_token: refresh_token,
        token_type: "Bearer",
        expires_in: 3600
      });
    }
  }

  static async introspect(req: Request, res: Response) {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "missing_token" });
    }

    const stored = await prisma.oAuthAccessToken.findUnique({
      where: { token },
    });

    if (!stored) {
      return res.json({ active: false });
    }

    if (stored.expiresAt < new Date()) {
      return res.json({ active: false });
    }

    return res.json({
      active: true,
      user_id: stored.userId,
      client_id: stored.clientId,
      scope: stored.scope,
      expires_at: stored.expiresAt,
    });
  }
}
