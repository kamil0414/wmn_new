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
    const { numer_mieszkania, stan, data, typ } = req.body;
    await prisma.$queryRawUnsafe(
      `call DodajOdczytWodomierza(${numer_mieszkania}, ${stan}, ${
        "'" + data + "'"
      }, ${typ})`
    );
    res.status(200).json({ message: "Added" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
