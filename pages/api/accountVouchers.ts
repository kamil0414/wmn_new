import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { onlyIncomes } = req.query;
    const result =
      await prisma.$queryRaw`select * from PodajTypyDowodowKsiegowych(${
        !onlyIncomes == "false"
      });`;
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
