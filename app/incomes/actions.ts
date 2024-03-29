"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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
    revalidatePath("/incomes");
    revalidatePath("/incomes/add");
    revalidateTag("operationSums");
  } catch (e) {
    return { message: `Error ${e}` };
  }
}
