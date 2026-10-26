"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  return (
    <nav>
      <Link href="/">Trang chu</Link>
      <Link href="/about">Gioi thieu</Link>
      <Link href="/dashboard">Dashboard</Link>
      {session?.user.role === "admin" && <Link href="/admin">Admin</Link>}
      <span className="spacer" />
      {session ? (
        <>
          <span>
            {session.user.name} ({session.user.role})
          </span>
          <button className="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
            Dang xuat
          </button>
        </>
      ) : (
        <Link href="/login">Dang nhap</Link>
      )}
    </nav>
  );
}
