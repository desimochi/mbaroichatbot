import { withIronSession } from "next-iron-session";
const sessionOptions = {
  password: process.env.SESSION_SECRET || "super_secure_password_at_least_32_characters_long!",
  cookieName: "mbaroi_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSession(handler) {
  return withIronSession(handler, sessionOptions);
}
