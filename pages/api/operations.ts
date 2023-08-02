import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getEndDateFromEnv, getStartDateFromEnv } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const { onlyExpenses } = req.query;
      if (onlyExpenses) {
        const result = await prisma.operacje.findMany({
          select: {
            id: true,
            data: true,
            czy_bank: true,
            ilosc: true,
            opis: true,
            kwota: true,
            rodzaj_i_numer_dowodu_ksiegowego: true,
            komentarz: true,
            firma: {
              select: {
                nazwa: true,
              },
            },
            opis_pow: {
              select: {
                opis: true,
                kategoria_wydatku: {
                  select: {
                    nazwa: true,
                  },
                },
              },
            },
          },
          where: {
            OR: [
              {
                kwota: {
                  lte: 0,
                },
              },
              {
                rodzaj_i_numer_dowodu_ksiegowego: {
                  equals: "Bilans otwarcia",
                },
              },
            ],
            data: {
              gte: getStartDateFromEnv(),
              lte: getEndDateFromEnv(),
            },
          },
          orderBy: [
            {
              data: "asc",
            },
            {
              rodzaj_i_numer_dowodu_ksiegowego: "asc",
            },
            {
              firma: {
                nazwa: "asc",
              },
            },
          ],
        });
        res.status(200).json(result);
      }
    } else if (req.method === "POST") {
      const {
        id_firmy,
        data,
        rodzaj_i_numer_dowodu_ksiegowego,
        id_opisu,
        kwota,
        czy_bank,
        id_subkonta,
        ilosc,
        komentarz,
      } = req.body;
      await prisma.operacje.create({
        data: {
          id_firmy,
          data: new Date(data),
          rodzaj_i_numer_dowodu_ksiegowego,
          id_opisu,
          kwota,
          czy_bank,
          id_subkonta,
          ilosc,
          komentarz,
        },
      });
      res.status(200).json({ message: "Added" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
