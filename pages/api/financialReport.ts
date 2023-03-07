import { readFileSync } from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import path from "path";
import prisma from "../../lib/prisma";

export default async function handler(_req, res) {
  const file = path.join(process.cwd(), "templates", "financialReport.docx");
  const content = readFileSync(file, "binary");

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const data = null;
  const daneDoSprawozdania =
    await prisma.$queryRaw`select * from podajDaneDoSprawozdania(${data})`;
  const stanKont = await prisma.$queryRaw`select * from podajStanKont(${data})`;
  const wydatkiOpalWodaSmieci =
    await prisma.$queryRaw`select * from podajWydatkiOpalWodaSmieci(${data})`;
  const wydatkiFun =
    await prisma.$queryRaw`select * from podajWydatkiFun(${data})`;
  const endDate = new Date().toISOString();

  doc.render({
    zalOpal: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].zalopal),
    zalWoda: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].zalwoda),
    jestOdszk: daneDoSprawozdania[0].odszk > 0,
    odszk: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].odszk),
    bilOtwOW: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].bilotwow),
    oWWplRaz: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].owwplraz),
    zalFundusz: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].zalfundusz),
    bilOtwF: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].bilotwf),
    fWplRazem: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].fwplrazem),
    odsetki: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].odsetki),
    wplRaz: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].wplraz),
    wydOW: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].wydow),
    wydF: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].wydf),
    prowizje: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].prowizje),
    wydRaz: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(daneDoSprawozdania[0].wydraz),
    kasa: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(stanKont[0].kasa),
    bank: new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(stanKont[0].bank),
    blad: daneDoSprawozdania[0].bilans !== stanKont[0].razem,
    bilans:
      daneDoSprawozdania[0].bilans === stanKont[0].razem
        ? new Intl.NumberFormat("pl-PL", {
            style: "currency",
            currency: "PLN",
          }).format(daneDoSprawozdania[0].bilans)
        : `NIEZGODNOŚĆ: ${stanKont[0].razem - daneDoSprawozdania[0].bilans}`,
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
