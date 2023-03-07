import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  message?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "GET") {
      const { onlyExpenses } = req.query;
      if (onlyExpenses) {
        const result = await prisma.$queryRaw`select * from PodajWydatki();`;
        res.status(200).json(result);
      }
    } else if (req.method === "POST") {
      const {
        id_firmy,
        data,
        rodzaj_i_numer_dowodu_ksiegowego,
        opis,
        kwota,
        czy_bank,
        id_subkonta,
      } = req.body;
      await prisma.operacje.create({
        data: {
          id_firmy,
          data: new Date(data),
          rodzaj_i_numer_dowodu_ksiegowego,
          opis,
          kwota,
          czy_bank,
          id_subkonta,
        },
      });
      res.status(200)
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
