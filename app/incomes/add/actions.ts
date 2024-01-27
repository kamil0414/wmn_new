"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";

// eslint-disable-next-line
const revalidate = true;

export const saveWater = async ({
  numer_mieszkania,
  stan,
  data,
  typ,
}: {
  numer_mieszkania: number;
  stan: number;
  data: Date;
  typ: number;
}) => {
  try {
    const { id } = await prisma.odczyt_wodomierza.create({
      data: {
        numer_mieszkania,
        stan,
        data,
        typ,
      },
    });
    if (id) {
      await prisma.$queryRawUnsafe(
        `call naliczwode(${`'${
          data.toISOString().split("T")[0]
        }'`}, ${numer_mieszkania})`,
      );
    }
    revalidatePath("/incomes/add");
  } catch (e) {
    return { message: `Error ${e}` };
  }
};

export const saveIncome = async ({
  id_firmy,
  data,
  id_opisu,
  id_typu_dowodu_ksiegowego,
  numer_dowodu_ksiegowego,
  kwota,
  czy_bank,
  id_subkonta,
}: {
  id_firmy: number;
  data: Date;
  id_opisu: number;
  id_typu_dowodu_ksiegowego: number;
  numer_dowodu_ksiegowego: string;
  kwota: number;
  czy_bank: boolean;
  id_subkonta: number;
}) => {
  try {
    await prisma.operacja.create({
      data: {
        id_firmy,
        data,
        id_opisu,
        id_typu_dowodu_ksiegowego,
        numer_dowodu_ksiegowego,
        kwota,
        czy_bank,
        id_subkonta,
      },
    });
    revalidatePath("/incomes");
    revalidatePath("/incomes/add");
    revalidateTag("operationSums");
  } catch (e) {
    return { message: `Error ${e}` };
  }
};

export const deleteIncome = async (id: number, isWaterBill: boolean) => {
  try {
    if (!isWaterBill) {
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
    } else {
      const bill = await prisma.naliczenie.update({
        where: {
          id,
        },
        data: {
          is_deleted: true,
        },
      });
      if (bill.id_stanu_licznika) {
        await prisma.odczyt_wodomierza.update({
          where: {
            id: bill.id_stanu_licznika,
          },
          data: {
            is_deleted: true,
          },
        });
      }
      revalidatePath("/incomes");
      revalidatePath("/incomes/add");
      revalidateTag("operationSums");
    }
  } catch (e) {
    return { message: `Error ${e}` };
  }
};
