import { Hypothek } from "@prisma/client";
import * as express from "express";
import prisma from "../model/db";

let router = express.Router();

router.get("/", async (req, res) => {
  const hypothek = await prisma.hypothek.findMany();
  res.render("index", {
    hypotheken: hypothek.sort((
      a: Hypothek,
      b: Hypothek,
    ) => b.aufnahmeDatum.getMilliseconds() - a.aufnahmeDatum.getMilliseconds()),
  });
});

export default router;
