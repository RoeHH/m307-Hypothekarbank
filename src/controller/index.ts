import { Hypothek } from "@prisma/client";
import * as express from "express";
import prisma from "../model/db";

let router = express.Router();

router.get("/", async (req, res) => {
  const hypotheken = await prisma.hypothek.findMany();
  const entriesPromise = hypotheken.sort((
    a: Hypothek,
    b: Hypothek,
  ) => b.aufnahmeDatum.getMilliseconds() - a.aufnahmeDatum.getMilliseconds())
    .map(async (hypothek) => {
      return {
        hypothek: hypothek,
        kunde: await prisma.kunde.findUnique({
          where: { id: hypothek.kundeId },
        }),
      };
    });
  Promise.all(entriesPromise).then((entries) => {
    res.render("index", {
      entries,
    });
  });
});

export default router;