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
    const { numer_mieszkania, stan, data, typ } = req.body;
    const { id } = await prisma.odczyty_wodomierzy.create({
      data: {
        numer_mieszkania,
        stan,
        data: new Date(data),
        typ,
      },
    });

    if (id) {
      await prisma.$queryRawUnsafe(
        `call naliczwode(${`'${data}'`}, ${numer_mieszkania})`,
      );
      res.status(200).json({ message: "Added" });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
