import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getEndDateFromEnv } from "../../utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const endDate = getEndDateFromEnv().toISOString().split("T")[0];
    const result: Array<any> = await prisma.$queryRawUnsafe(
      `select * from PodajZajeteNumeryKP(${`'${endDate}'`})`,
    );
    const array = result.map(({ nr }) => parseInt(nr, 10));
    res.status(200).json(array);
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
