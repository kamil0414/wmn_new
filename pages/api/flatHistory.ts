import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getEndDateFromEnv, getStartDateFromEnv } from "../../utils";

type Data = {
  message?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  interface QueryProps {
    flat_number: string;
  }

  try {
    const { flat_number }: Partial<QueryProps> = req.query;
    const result = await prisma.kartoteki.findMany({
      select: {
        id: true,
        data: true,
        naleznosc: true,
        opis: true,
        saldo: true,
        wplata: true,
      },
      where: {
        AND: [
          {
            numer_mieszkania: {
              equals: parseInt(flat_number),
            },
          },
          {
            data: {
              gte: getStartDateFromEnv(),
              lte: getEndDateFromEnv(),
            },
          },
        ],
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
