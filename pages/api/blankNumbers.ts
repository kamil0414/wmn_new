import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { getEndDateFromEnv } from "../../utils";

type Data = {
  message?: any;
  nr?: string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const endDate = getEndDateFromEnv().toISOString().split('T')[0];
    const result: Array<Data> =
      await prisma.$queryRawUnsafe(`select * from PodajZajeteNumeryKP(${"'"+endDate+"'"})`);
    const array = [];
    result.forEach((el) => {
      array.push(parseInt(el.nr));
    });
    // @ts-ignore
    res.status(200).json(array);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
