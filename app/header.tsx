/* eslint-disable no-underscore-dangle */
import prisma from "@/lib/prisma";
import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import HeaderNav from "./headerNav";

async function Header() {
  const accountState = await prisma.operacje.groupBy({
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

  return (
    <HeaderNav
      accountState={accountState[1]._sum.kwota?.toNumber() ?? 0}
      cashState={accountState[0]._sum.kwota?.toNumber() ?? 0}
    />
  );
}

export default Header;
