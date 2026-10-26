"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function Form() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: data.get("email"),
      password: data.get("password"),
      redirect: false,
    });
    if (res?.error) setError("Sai email hoac mat khau");
    else window.location.assign(callbackUrl);
  }

  return (
    <>
      <form className="stack" onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" autoComplete="email" required />
        <input name="password" type="password" placeholder="Mat khau" autoComplete="current-password" required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Dang nhap</button>
      </form>
      <p>hoac</p>
      <button onClick={() => signIn("github", { callbackUrl })}>Dang nhap voi GitHub</button>
    </>
  );
}

export default function LoginForm() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
