
# 🚀 IAM Plus — Enterprise OAuth2 Authorization Server  
### **Production-Grade Identity & Access Management (Node.js + TypeScript + Prisma + PostgreSQL)**  
A fully featured **OAuth2 Authorization Server** built with enterprise patterns, clean architecture, and modern standards.

IAM Plus provides:

- 🔐 **OAuth2 Authorization Code Flow (with PKCE)**
- 🔑 **Access Tokens + Refresh Tokens**
- 👤 **Session Login + Consent Screen**
- 🧩 **RBAC (Role-Based Access Control)**
- 🛡 **Rate Limiting + Audit Logging**
- 🗄 **Prisma 7 ORM + PostgreSQL**
- 🔎 **Token Introspection**
- 🌐 **Service-to-Service Integration (Notify Plus)**

This is a **portfolio-grade, production-style identity service**.

---

# 🏆 Highlights

### ✔ Microservice-ready OAuth2 server  
### ✔ Secure PKCE-enabled authorization  
### ✔ Admin portal for OAuth client management  
### ✔ Clean TypeScript architecture  
### ✔ Real PostgreSQL schemas + migrations  
### ✔ Integrates directly with Notify Plus (email/SMS/webhooks)

---

# 🏗 Architecture Diagram

```
Browser → IAM Plus → Consent → Auth Code → Token → Protected API
                              ↓
                       Notify Plus (Welcome Email)
```

---

# 📚 Features Overview

### 🔐 Authentication
- Email/password login  
- Express session-based UI login  
- Secure cookie handling  

### 🔓 Authorization
- OAuth2 Authorization Code Flow  
- PKCE support (S256)  
- Consent screen  
- Single-use Authorization Codes  

### 🔑 Token System
- Short-lived access tokens  
- Long-lived refresh tokens  
- Token introspection endpoint  
- JWT-based token generation  

### 🧩 RBAC
- Roles  
- Permissions  
- User-role linking  
- Admin-only API routes  

### 📜 Audit & Security
- Rate limiting  
- Audit log table  
- Failed login tracking  
- Prisma-level schema security  

---

# 📦 Project Structure

```
src/
  controllers/
  services/
  middleware/
  routes/
  db/
  views/
  app.ts
prisma/
  schema.prisma
  prisma.config.ts
```

---

# 🚀 Getting Started

### Clone & Install
```bash
git clone https://github.com/farazmh/iam-plus
cd iam-plus
npm install
```

### Database Setup
Create PostgreSQL database:
```
iamdb
```

### Environment Variables
`.env`
```
DATABASE_URL="postgresql://postgres:password@localhost:5434/iamdb"
SESSION_SECRET="supersecret"
NOTIFY_URL="http://localhost:4001"
NOTIFY_SERVICE_TOKEN="notify_internal_123"
```

### Migrate + Seed
```bash
npx prisma migrate dev
npm run seed
```

Default Admin:
```
admin@iam.plus / admin123
```

### Run
```bash
npm run dev
```
Runs at:
```
http://localhost:4000
```

---

# 🔗 Key OAuth2 Endpoints

| Endpoint | Purpose |
|---------|---------|
| `/oauth/authorize` | Start OAuth2 Authorization Code flow |
| `/oauth/token` | Exchange code → Access Token |
| `/oauth/introspect` | Validate an access token |
| `/login` | User login screen |
| `/consent` | Consent approval page |

---

# 🤝 Integration with Notify Plus

IAM Plus automatically sends:

- 🎉 Welcome Email on registration  
- 📣 System notifications in future (password reset, MFA, etc.)  

Internal communication uses secure headers:
```
x-service-token: notify_internal_123
```

---

# 🏁 Final Notes
IAM Plus is engineered as a **real production-ready identity platform**.  
It pairs perfectly with **Notify Plus** to form a complete backend ecosystem.

---

# ⭐ Author
Built by **Faraz Munavar Hussain**, Backend Engineer & Systems Architect.
