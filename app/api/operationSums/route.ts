import prisma from "@/lib/prisma";
import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import { NextResponse } from "next/server";

// eslint-disable-next-line
const revalidate = true;

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  try {
    const data = await prisma.operacja.groupBy({
      by: ["czy_bank"],
      _sum: {
        kwota: true,
      },
      where: {
        data: {
          gte: getStartDateFromEnv(),
          lte: getEndDateFromEnv(),
        },
        is_deleted: false,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
