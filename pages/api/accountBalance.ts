import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getEndDateFromEnv } from "../../utils";

type Data = {
  message?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const endDate = getEndDateFromEnv().toISOString().split('T')[0];
    const result = await prisma.$queryRawUnsafe(`select * from PodajStanKont(${"'"+endDate+"'"})`);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
