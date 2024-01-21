"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export default async function markRemindAsCompleted(id: number) {
  try {
    await prisma.przypomnienie.update({
      where: {
        id,
      },
      data: {
        czy_wykonane: true,
      },
    });
    await revalidatePath("/dashboard");
  } catch (e) {
    return { message: `Error ${e}` };
  }
}
