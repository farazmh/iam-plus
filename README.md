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

---

# 📦 Project Structure

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

---

# 🚀 Getting Started

Clone & install:
```bash
git clone https://github.com/farazmh/iam-plus
cd iam-plus
npm install
```

Create `.env`, run migrations:
```bash
npx prisma migrate dev
npm run seed
npm run dev
```

Admin login:
```
admin@iam.plus / admin123
```

---

# ⭐ Credits

Built by **Faraz Munavar Hussain**.
