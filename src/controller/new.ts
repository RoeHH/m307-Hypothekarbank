import * as express from "express";
import prisma, { RisikoStufe } from "../model/db";
import { addRiskToDate, getRisikoStufeFromString } from "./helpers";

let router = express.Router();

router.get("/", async (req, res) => {
  await render([], req, res);
});

router.post("/", async (req, res) => {
  if (
    !req.body.name || !req.body.vorname || !req.body.email || !req.body.wert ||
    !req.body.paket || !req.body.risk
  ) {
    await render([new Error("Bitte alle Felder ausfüllen")], req, res);
    return;
  }

  if (req.body.phone && !/^[0-9\s+\/\-\)\(]*$/.test(req.body.phone)) {
    await render(
      [
        new Error("Telefonnummer ist ungültig"),
      ],
      req,
      res,
    );
    return;
  }

  const risikostufe: RisikoStufe | Error = getRisikoStufeFromString(
    req.body.risk,
  );

  if (risikostufe instanceof Error) {
    await render([risikostufe], req, res);
    return;
  }

  try {
    await prisma.hypothek.create({
      data: {
        kunde: {
          create: {
            name: req.body.name,
            vorname: req.body.vorname,
            email: req.body.email,
            telefon: req.body.phone,
          },
        },
        paket: {
          connect: {
            bezeichnung: req.body.paket.split("|")[0].trim(),
          },
        },
        risikostufe: RisikoStufe[risikostufe],
        aufnahmeDatum: new Date(),
        rueckzahlungsDatum: addRiskToDate(new Date(), risikostufe),
        rueckzahlungsStatus: "offen",
        wert: req.body.wert,
      },
    });
  } catch (e) {
    await render(
      [new Error("Something went wrong while writing to the Database")],
      req,
      res,
    );
    return;
  }
  res.redirect("/");
});

async function render(
  errors: Error[],
  req: express.Request,
  res: express.Response,
) {
  res.render("hypothekForm", {
    title: "Neue Hypothek",
    action: "/new",
    errors,
    isEdit: false,
    risikoStufen: Object.keys(RisikoStufe).map((key) => {
      key = key.replace(/([A-Z])/g, " $1");
      return key.charAt(0).toUpperCase() + key.slice(1);
    }),
    hypothekPakete: (await prisma.hypothekPaket.findMany({})).map((paket) =>
      paket.bezeichnung + " | " + paket.zinsen + " %"
    ),
    csrfToken: req.csrfToken(),
  });
}

export default router;
