import * as express from "express";
import prisma, { RisikoStufe, RueckzahlungsStatus } from "../model/db";
import {
  addRiskToDate,
  getRisikoStufeFromString,
  getRueckzahlungsstatusFromString,
  validateBody,
} from "./helpers";

let router = express.Router();

router.get("/:id", async (req, res) => {
  if (Number(req.params.id) !== NaN) {
    await render([], req, res);
  } else {
    res.redirect("/");
  }
});

router.post("/:id", async (req, res) => {
  if (Number(req.params.id) !== NaN) {

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
      { name: "status", required: true },
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

    const rueckzahlungsStatus: RueckzahlungsStatus | Error =
      getRueckzahlungsstatusFromString(
        req.body.status,
      );

    if (rueckzahlungsStatus instanceof Error) {
      await render([rueckzahlungsStatus], req, res);
      return;
    }

    try {
      await prisma.hypothek.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          kunde: {
            update: {
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
          risikostufe: risikostufe,
          rueckzahlungsDatum: addRiskToDate(
            new Date(),
            risikostufe,
          ),
          rueckzahlungsStatus: rueckzahlungsStatus,
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
  }else{
    res.sendStatus(404);
  }
});

async function render(
  errors: Error[],
  req: express.Request,
  res: express.Response,
) {
  const hypothek = await prisma.hypothek.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });
  if (hypothek !== null) {
    const kunde = await prisma.kunde.findUnique({
      where: {
        id: hypothek.kundeId,
      },
    });
    const paket = await prisma.hypothekPaket.findUnique({
      where: {
        bezeichnung: hypothek.paketBez,
      },
    });

    res.render("hypothekForm", {
      title: "Hypothek bearbeiten",
      action: "/edit/" + req.params.id,
      errors: errors,
      isEdit: true,
      values: {
        "name": kunde?.name,
        "vorname": kunde?.vorname,
        "email": kunde?.email,
        "phone": kunde?.telefon,
        "wert": hypothek?.wert,
        "paket": paket?.bezeichnung + " | " + paket?.zinsen + " %",
        "risk": RisikoStufe[hypothek.risikostufe].charAt(0).toUpperCase() +
          RisikoStufe[hypothek.risikostufe].replace(/([A-Z])/g, " $1").slice(
            1,
          ),
        "rückzahlungsStatus":
          hypothek?.rueckzahlungsStatus.charAt(0).toUpperCase() +
          hypothek?.rueckzahlungsStatus.slice(1),
      },
      risikoStufen: Object.keys(RisikoStufe).map((key) => {
        key = key.replace(/([A-Z])/g, " $1");
        return key.charAt(0).toUpperCase() + key.slice(1);
      }),
      hypothekPakete: (await prisma.hypothekPaket.findMany({})).map((paket) =>
        paket.bezeichnung + " | " + paket.zinsen + " %"
      ),
      statuses: Object.keys(RueckzahlungsStatus).map((key) => {
        return key.charAt(0).toUpperCase() + key.slice(1);
      }),
      csrfToken: req.csrfToken(),
    });
  } else {
    res.redirect("/");
  }
}
export default router;
