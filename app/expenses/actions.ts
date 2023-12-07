"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const deleteExpense = async (id: number) => {
  try {
    const expense = await prisma.operacja.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
      },
    });
    revalidatePath("/", "layout");
    return { message: `Deleted ${expense}` };
  } catch (e) {
    return { message: `Error ${e}` };
  }
};

export default deleteExpense;
