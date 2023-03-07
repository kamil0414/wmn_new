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
    const result = await prisma.$queryRaw`select * from PodajStanKont();`;
    res.status(200).json(result[0]);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
