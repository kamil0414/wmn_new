import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getEndDateFromEnv, getStartDateFromEnv } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  interface QueryProps {
    flat_number: string;
  }

  try {
    const { flat_number }: Partial<QueryProps> = req.query;
    if (!flat_number) {
      return res.status(200).json([]);
    }
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
              equals: parseInt(flat_number, 10),
            },
          },
          {
            data: {
              gte: getStartDateFromEnv(),
              lte: new Date(
                Math.max(
                  getEndDateFromEnv().setDate(10),
                  getEndDateFromEnv().getTime(),
                ),
              ),
            },
          },
        ],
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}
