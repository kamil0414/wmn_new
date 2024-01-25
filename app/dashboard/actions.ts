"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// eslint-disable-next-line
const revalidate = true;

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
    revalidatePath("/dashboard");
  } catch (e) {
    return { message: `Error ${e}` };
  }
}
