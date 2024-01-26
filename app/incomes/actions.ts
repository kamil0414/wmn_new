"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";

// eslint-disable-next-line
const revalidate = true;

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
    revalidateTag("operationSums");
    revalidatePath("/incomes");
    revalidatePath("/incomes/add");
  } catch (e) {
    return { message: `Error ${e}` };
  }
}
