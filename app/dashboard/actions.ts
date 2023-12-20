"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const markRemindAsCompleted = async (id: number) => {
  try {
    const reminder = await prisma.przypomnienie.update({
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
};
