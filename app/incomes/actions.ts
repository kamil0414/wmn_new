"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export default async function deleteIncome(id: number) {
  try {
    await prisma.operacja.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
      },
    });
    await revalidatePath("/", "layout");
  } catch (e) {
    return { message: `Error ${e}` };
  }
}
