"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

const saveExpense = async ({
  id_firmy,
  data,
  id_opisu,
  rodzaj_i_numer_dowodu_ksiegowego,
  kwota,
  czy_bank,
  id_subkonta,
  ilosc,
  komentarz,
  nazwaNowejFirmy,
}: {
  id_firmy: number;
  data: Date;
  id_opisu: number;
  rodzaj_i_numer_dowodu_ksiegowego: string;
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
      const { id } = await prisma.firmy.create({
        data: {
          nazwa: nazwaNowejFirmy,
        },
      });
      await prisma.opisy.update({
        data: {
          firmy: {
            connect: {
              id,
            },
          },
        },
        where: {
          id: id_opisu,
        },
      });
      id_firmyCond = id;
    }

    const expense = await prisma.operacje.create({
      data: {
        id_firmy: id_firmyCond,
        data,
        id_opisu,
        rodzaj_i_numer_dowodu_ksiegowego,
        kwota,
        czy_bank,
        id_subkonta,
        ilosc,
        komentarz,
      },
    });
    revalidatePath("/", "layout");
    return { message: `Added ${expense}` };
  } catch (e) {
    return { message: `Error ${e}` };
  }
};

export default saveExpense;
