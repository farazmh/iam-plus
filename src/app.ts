import express from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware";
import { auditLogger } from "./middleware/audit.middleware";
import adminRoutes from "./routes/admin.routes";
import oauthRoutes from "./routes/oauth.routes";
import pageRoutes from "./routes/pages.routes";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(globalRateLimiter);
app.use(auditLogger);

app.get("/", (req, res) => {
  res.send({ message: "IAM Plus API is running" });
});

app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/oauth", oauthRoutes);

export default app;
