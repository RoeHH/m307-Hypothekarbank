import * as express from "express";
import prisma, { RisikoStufe } from "../model/db";

let router = express.Router();

router.get("/", async (req, res) => {
  res.render("new", {
    risikoStufen: Object.keys(RisikoStufe).map((key) => {
      key = key.replace(/([A-Z])/g, " $1");
      return key.charAt(0).toUpperCase() + key.slice(1);
    }),
    hypothekPakete: (await prisma.hypothekPaket.findMany({})).map((paket) =>
      paket.bezeichnung + " | " + paket.zinsen + " %"
    ),
    csrfToken: req.csrfToken(),
  });
});

router.post("/", async (req, res) => {
  
    await prisma.hypothek.create({
        data: {
            kunde: {
                create: {
                    name: req.body.name,
                    vorname: req.body.vorname,
                    email: req.body.email,
                    telefon: req.body.telefon,
                },
            },
            paket: {
                connect: {
                    bezeichnung: req.body.paket.split("|")[0].trim(),
                },
            },
            risikostufe: RisikoStufe[req.body.risk.charAt(0).toLowerCase() + req.body.risk.split(" ").join("").slice(1)],
            rueckzahlungsDatum: new Date(2067, 11, 24),//TODO: add date with risk
            rueckzahlungsStatus: "offen",
            wert: req.body.wert,
        }
    });
  res.redirect("/");
});

export default router;
