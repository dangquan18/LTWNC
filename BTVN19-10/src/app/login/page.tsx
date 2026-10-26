import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Dang nhap",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main>
      <h1>Dang nhap</h1>
      <LoginForm />
    </main>
  );
}
