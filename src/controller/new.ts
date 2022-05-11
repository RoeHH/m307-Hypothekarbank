import * as express from "express";
import prisma, { RisikoStufe } from "../model/db";
import {
  addRiskToDate,
  getRisikoStufeFromString,
  validateBody,
} from "./helpers";

let router = express.Router();

router.get("/", async (req, res) => {
  await render([], req, res);
});

router.post("/", async (req, res) => {
  const errors = validateBody(req.body, [
    { name: "name", required: true },
    { name: "vorname", required: true },
    {
      name: "email",
      required: true,
      regex:
        /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    },
    { name: "phone", regex: /^[0-9\s+\/\-\)\(]*$/ },
    { name: "wert", required: true },
    { name: "paket", required: true },
    { name: "risk", required: true },
  ]);
  if (errors.length > 0) {
    await render(errors, req, res);
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
