import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listUsers } from "@/lib/users";
import { changeRole } from "./actions";

export const metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/forbidden");

  return (
    <main>
      <h1>Quan tri nguoi dung</h1>
      <table>
        <thead>
          <tr>
            <th>Ten</th>
            <th>Email</th>
            <th>Vai tro</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {listUsers().map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.id !== session.user.id && (
                  <form action={changeRole}>
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="role" value={u.role === "admin" ? "user" : "admin"} />
                    <button className="secondary">{u.role === "admin" ? "Ha xuong user" : "Nang len admin"}</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
