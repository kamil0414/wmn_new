import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  message?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const result = await prisma.$queryRaw`select * from PodajFirmy();`;
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
