import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default async function Dashboard() {
  // Lop 2: kiem tra lai o page (phong khi middleware bi bo qua).
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/dashboard");
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Xin chao {session.user.name}, vai tro: {session.user.role}.</p>
    </main>
  );
}
