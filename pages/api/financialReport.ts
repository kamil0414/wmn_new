import { readFileSync } from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import path from "path";
import prisma from "../../lib/prisma";
import { getEndDateFromEnv, formatter } from "../../utils";

export default async function handler(_req, res) {
  const file = path.join(process.cwd(), "templates", "financialReport.docx");
  const content = readFileSync(file, "binary");

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const endDate = getEndDateFromEnv().toISOString().split("T")[0];
  const daneDoSprawozdania = await prisma.$queryRawUnsafe(
    `select * from podajDaneDoSprawozdania(${"'" + endDate + "'"})`
  );
  const stanKont = await prisma.$queryRawUnsafe(
    `select * from podajStanKont(${"'" + endDate + "'"})`
  );
  const wydatkiOpalWodaSmieci = await prisma.$queryRawUnsafe(
    `select * from podajWydatkiOpalWodaSmieci(${"'" + endDate + "'"})`
  );
  const wydatkiFun = await prisma.$queryRawUnsafe(
    `select * from podajWydatkiFun(${"'" + endDate + "'"})`
  );

  const blad =
    formatter.format(parseFloat(daneDoSprawozdania[0].bilans)) !==
    formatter.format(
      parseFloat(stanKont[0]?.suma) + parseFloat(stanKont[1]?.suma)
    );

  doc.render({
    zalOpal: formatter.format(daneDoSprawozdania[0].zalopal),
    zalWoda: formatter.format(daneDoSprawozdania[0].zalwoda),
    jestOdszk: daneDoSprawozdania[0].odszk > 0,
    odszk: formatter.format(daneDoSprawozdania[0].odszk),
    bilOtwOW: formatter.format(daneDoSprawozdania[0].bilotwow),
    oWWplRaz: formatter.format(daneDoSprawozdania[0].owwplraz),
    zalFundusz: formatter.format(daneDoSprawozdania[0].zalfundusz),
    bilOtwF: formatter.format(daneDoSprawozdania[0].bilotwf),
    fWplRazem: formatter.format(daneDoSprawozdania[0].fwplrazem),
    odsetki: formatter.format(daneDoSprawozdania[0].odsetki),
    wplRaz: formatter.format(daneDoSprawozdania[0].wplraz),
    wydOW: formatter.format(daneDoSprawozdania[0].wydow),
    wydF: formatter.format(daneDoSprawozdania[0].wydf),
    prowizje: formatter.format(daneDoSprawozdania[0].prowizje),
    wydRaz: formatter.format(daneDoSprawozdania[0].wydraz),
    kasa: formatter.format(stanKont[0]?.suma),
    bank: formatter.format(stanKont[1]?.suma),
    blad,
    bilans: !blad
      ? formatter.format(daneDoSprawozdania[0].bilans)
      : `NIEZGODNOŚĆ: ${formatter.format(
          parseFloat(stanKont[0]?.suma) +
            parseFloat(stanKont[1]?.suma) -
            parseFloat(daneDoSprawozdania[0].bilans)
        )}`,
    wydOpalWoda: wydatkiOpalWodaSmieci,
    wydFun: wydatkiFun,
    rok: endDate.slice(0, 4),
    poprzRok: parseFloat(endDate.slice(0, 4)) - 1,
    data: endDate.split("T")[0],
    jestKonRok: endDate.indexOf("12-31") !== -1,
  });

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  // res.contentType('application/msword');
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Sprawozdanie finansowe ${endDate.split("T")[0]}.docx`
  );
  res.send(buf);
}
