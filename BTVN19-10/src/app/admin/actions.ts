"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { setUserRole } from "@/lib/users";

// Lop 3: Server Action la endpoint POST cong khai, phai tu kiem tra quyen.
export async function changeRole(formData: FormData) {
  const session = await requireRole("admin");
  const id = String(formData.get("id"));
  const role = formData.get("role");
  if (role !== "admin" && role !== "user") throw new Error("INVALID_ROLE");
  if (id === session.user.id) throw new Error("CANNOT_CHANGE_SELF");
  setUserRole(id, role);
  revalidatePath("/admin");
}
