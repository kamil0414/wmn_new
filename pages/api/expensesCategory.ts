import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const data = await prisma.kategorie_wydatkow.findMany({
        select: {
          id: true,
          nazwa: true,
          id_subkonta: true,
          opisy: {
            select: {
              id: true,
              opis: true,
              ilosc_wymagana: true,
              jednostka_miary: true,
              firmy: {
                select: {
                  id: true,
                  nazwa: true,
                },
                orderBy: [
                  {
                    nazwa: "asc",
                  },
                ],
              },
              typy_dowodow_ksiegowych: {
                select: {
                  id: true,
                  opis: true,
                },
                orderBy: [
                  {
                    opis: "asc",
                  },
                ],
              },
            },
            orderBy: [
              {
                opis: "asc",
              },
            ],
          },
        },
        where: {
          AND: [
            {
              nazwa: {
                not: "Bilans otwarcia",
              },
            },
            {
              czy_wydatek: true
            },
          ]
        },
        orderBy: [
          {
            nazwa: "asc",
          },
        ],
      });
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
