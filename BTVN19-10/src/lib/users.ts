import bcrypt from "bcryptjs";
import type { Role } from "@/types/next-auth";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}

// Demo store (khong dung DB). Mat khau duoc hash bang bcrypt khi khoi dong.
const users: StoredUser[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: "2",
    name: "User",
    email: "user@example.com",
    passwordHash: bcrypt.hashSync("user123", 10),
    role: "user",
  },
];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function listUsers() {
  return users.map(({ passwordHash: _omit, ...rest }) => rest);
}

export function setUserRole(id: string, role: Role) {
  const user = users.find((u) => u.id === id);
  if (!user) return false;
  user.role = role;
  return true;
}

export function roleForEmail(email?: string | null): Role {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return email && admins.includes(email.toLowerCase()) ? "admin" : "user";
}
