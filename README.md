# IAM Plus — OAuth2 Authorization Server (Node.js + Prisma + PostgreSQL)

IAM Plus is a production-grade **OAuth2 Authorization Server** implementing:

- Authorization Code Flow (+ PKCE)
- Access tokens + Refresh tokens
- Consent screen
- Session-based login
- Token introspection
- RBAC (Role-Based Access Control)
- Audit logs + rate limiting
- Prisma ORM (PostgreSQL)

All written in clean, scalable **TypeScript**.

---

# 🏷 Badges

![Node](https://img.shields.io/badge/Node.js-22+-green)
![Prisma](https://img.shields.io/badge/Prisma-7-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![OAuth2](https://img.shields.io/badge/OAuth2-Authorization_Code_Flow-orange)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

# 🏗 Architecture Overview

IAM Plus follows a clean, modular OAuth2 Authorization Server architecture:

- Browser login using express-session  
- Authorization endpoint with consent  
- Authorization Code issuance (single-use)  
- Token endpoint with PKCE verification  
- Short-lived access tokens  
- Long-lived refresh tokens  
- Token introspection for APIs/microservices  
- Admin-only OAuth client creation  
- Role-based access permissions  
- Prisma ORM schema  
- PostgreSQL backend  

Architecture inspiration:

![OAuth Architecture](https://raw.githubusercontent.com/google/oauth2client/master/docs/images/oauth2-architecture.png)

---

# 🔄 OAuth2 Flow (Sequence)

**Authorization Code Flow (with PKCE):**

1. Client redirects user to `/oauth/authorize`
2. Server redirects to `/login` if session missing  
3. User logs in  
4. Consent page shown  
5. User approves → server generates authorization code  
6. Client exchanges code at `/oauth/token`  
7. Server returns access token + refresh token  
8. Client calls protected APIs  
9. APIs use `/oauth/introspect` to validate token  

High-level diagram:

![OAuth Flow](https://developers.google.com/static/identity/protocols/oauth2/images/authorization-code-flow.png)

---

# 📦 Project Structure

```
src/
  controllers/
    oauth.controller.ts
    page.controller.ts
    auth.controller.ts
  routes/
    oauth.routes.ts
    pages.routes.ts
    auth.routes.ts
  middleware/
    verifyAccessToken.ts
  db/
    prisma.ts
  services/
    oauth.service.ts
  app.ts
prisma/
  schema.prisma
  prisma.config.ts
  seed.ts
```

---

# 🚀 Getting Started

## 1. Clone & Install

```bash
git clone https://github.com/farazmh/iam-plus
cd iam-plus
npm install
```

---

## 2. Setup PostgreSQL

Create database:

```
iamdb
```

---

## 3. Environment Variables

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/iamdb"
SESSION_SECRET="supersecret"
```

---

## 4. Run Migrations

```bash
npx prisma migrate dev
```

---

## 5. Seed Admin User + RBAC

```bash
npm run seed
```

Admin login:

```
email: admin@iam.plus
password: admin123
```

---

## 6. Start Server

```bash
npm run dev
```

Runs at:

```
http://localhost:4000
```

---

# 🔐 OAuth2 Endpoints

## 1️⃣ `/oauth/authorize`  
Starts authorization flow.

Example:

```
http://localhost:4000/oauth/authorize?
response_type=code&
client_id=YOUR_CLIENT_ID&
redirect_uri=http://localhost:3000/callback&
scope=openid+email&
state=xyz
```

Redirects to:

- Login page  
- Then consent page  
- Then callback with code  

---

## 2️⃣ `/oauth/token` (authorization code → token)

```json
POST /oauth/token
{
  "grant_type": "authorization_code",
  "code": "<AUTH_CODE>",
  "client_id": "<CLIENT_ID>",
  "client_secret": "<CLIENT_SECRET>",
  "redirect_uri": "http://localhost:3000/callback"
}
```

Returns:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

---

## 3️⃣ `/oauth/token` (refresh token → new access token)

```json
POST /oauth/token
{
  "grant_type": "refresh_token",
  "refresh_token": "<REFRESH_TOKEN>",
  "client_id": "<CLIENT_ID>",
  "client_secret": "<CLIENT_SECRET>"
}
```

---

## 4️⃣ `/oauth/introspect`

```json
POST /oauth/introspect
{
  "token": "<ACCESS_TOKEN>"
}
```

Response:

```json
{
  "active": true,
  "user_id": "...",
  "client_id": "...",
  "expires_at": "...",
  "scope": ""
}
```

---

# 👤 Login & Consent Pages

The server includes:

- A clean login UI (HTML)  
- A branded consent screen  
- Seamless redirection back to OAuth flow  

---

# 🧩 Admin — Create OAuth Clients

```
POST /admin/oauth/clients
Authorization: Bearer <admin-token>
```

Body:

```json
{
  "name": "Test Client",
  "redirectUris": ["http://localhost:3000/callback"]
}
```

Response:

```json
{
  "clientId": "<public-id>",
  "clientSecret": "<secret>"
}
```

---

# 🧱 Security Features

- PKCE (S256) support  
- One-time authorization codes  
- Access tokens expire in 1 hour  
- Refresh tokens expire in 30 days  
- Session cookies (HTTPOnly)  
- Rate limiting  
- Audit logs  
- RBAC-based admin routes  

---

# 🧑‍💻 Development Notes

To reset database:

```bash
npx prisma migrate reset
npm run seed
```

View DB:

```bash
npx prisma studio
```

---

# ⭐ Credits

Built by **Faraz Munavar Hussain** with passion, discipline, and senior-level engineering.