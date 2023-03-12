import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const data = await prisma.kategorie_wydatkow.findMany({
        select: {
          id: true,
          nazwa: true,
          id_subkonta: true,
          opisy: {
            select: {
              id: true,
              opis: true,
              ilosc_wymagana: true,
              firmy: {
                select: {
                  id: true,
                  nazwa: true
                }
              },
              typy_dowodow_ksiegowych: {
                select: {
                  id: true,
                  opis: true
                }
              },
              // operacje: {
              //   select: {
              //     id: true
              //   }
              // }
            }
          }
        },
        where: {
          nazwa: {
            not: 'Bilans otwarcia'
          }
        },
        orderBy: {
          opisy: {

              // operacje: {
                _count: 'desc'
              // }
      
          }
        }
      });
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
}
