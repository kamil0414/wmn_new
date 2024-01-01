import prisma from "@/lib/prisma";

const incorrectDescriptions = async () =>
  prisma.niepoprawny_opis.findFirst({
    select: {
      zaczyna_sie_od: true,
      zawiera: true,
      konczy_sie_na: true,
    },
  });

export default incorrectDescriptions;
