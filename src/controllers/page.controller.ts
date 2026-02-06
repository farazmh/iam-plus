import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import bcrypt from "bcryptjs";

export class PageController {
  static loginPage(req: Request, res: Response) {
    const nextUrl = req.query.next || "/";

    res.send(`
      <html>
        <head>
          <title>Login</title>
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
              padding: 35px;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              width: 350px;
            }
            .title {
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
            }
            input {
              width: 100%;
              padding: 12px;
              margin-top: 10px;
              border: 1px solid #ccc;
              border-radius: 6px;
              font-size: 14px;
            }
            button {
              width: 100%;
              margin-top: 20px;
              padding: 12px;
              background: #4A90E2;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
            }
            button:hover {
              background: #3d7bc0;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">Sign in</div>

            <form method="POST" action="/auth/login-page">
              <input type="hidden" name="next" value="${nextUrl}" />

              <input type="email" name="email" placeholder="Email address" required />
              <input type="password" name="password" placeholder="Password" required />

              <button type="submit">Login</button>
            </form>
          </div>
        </body>
      </html>
  `);
  }


  static async loginPageSubmit(req: Request, res: Response) {
    const { email, password, next } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.send("Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.send("Invalid email or password");
    }

    // store user in session
    (req.session as any).userId = user.id;

    // redirect back to original OAuth authorize URL
    return res.redirect(next || "/");
  }
}
