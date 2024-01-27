"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const upsertExpense = async ({
  id,
  id_firmy,
  data,
  id_opisu,
  id_typu_dowodu_ksiegowego,
  numer_dowodu_ksiegowego,
  kwota,
  czy_bank,
  id_subkonta,
  ilosc,
  komentarz,
  nazwaNowejFirmy,
}: {
  id?: number;
  id_firmy: number;
  data: Date;
  id_opisu: number;
  id_typu_dowodu_ksiegowego: number;
  numer_dowodu_ksiegowego: string;
  kwota: number;
  czy_bank: boolean;
  id_subkonta: number;
  ilosc: number;
  komentarz: string;
  nazwaNowejFirmy?: string;
}) => {
  try {
    let id_firmyCond = id_firmy;

    if (nazwaNowejFirmy != null && nazwaNowejFirmy !== "") {
      const { id: companyId } = await prisma.firma.create({
        data: {
          nazwa: nazwaNowejFirmy,
        },
      });
      await prisma.opis.update({
        data: {
          firmy: {
            connect: {
              id: companyId,
            },
          },
        },
        where: {
          id: id_opisu,
        },
      });
      id_firmyCond = companyId;
    }

    await prisma.operacja.upsert({
      where: {
        id: id ?? -1,
      },
      update: {
        id_firmy: id_firmyCond,
        data,
        id_opisu,
        id_typu_dowodu_ksiegowego,
        numer_dowodu_ksiegowego,
        kwota,
        czy_bank,
        id_subkonta,
        ilosc,
        komentarz,
      },
      create: {
        id_firmy: id_firmyCond,
        data,
        id_opisu,
        id_typu_dowodu_ksiegowego,
        numer_dowodu_ksiegowego,
        kwota,
        czy_bank,
        id_subkonta,
        ilosc,
        komentarz,
      },
    });
    revalidatePath("/expenses");
    revalidateTag("operationSums");
  } catch (e) {
    return { message: `Error ${e}` };
  }
  redirect(`/expenses`);
};

export const deleteExpense = async (id: number) => {
  try {
    await prisma.operacja.update({
      where: {
        id,
      },
      data: {
        is_deleted: true,
      },
    });
    revalidatePath("/expenses");
    revalidateTag("operationSums");
  } catch (e) {
    return { message: `Error ${e}` };
  }
};
