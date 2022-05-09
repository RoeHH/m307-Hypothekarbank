// This file is will be run when the project is started with `npm run dev`
// It will seed the database with some data

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.kunde.deleteMany({});
  await prisma.hypothek.deleteMany({});
  await prisma.hypothekPaket.deleteMany({});

  
  await prisma.kunde.create({
    data: {
      name: "Doe",
      vorname: "John",
      email: "john@doe.com",
      telefon: "+49 123456789",
    },
  });


  await prisma.hypothekPaket.createMany({
    data: [
      {
        bezeichnung: "Fest 2",
        zinsen: 0.54,
      },
      {
        bezeichnung: "Fest 3",
        zinsen: 0.54,
      },
      {
        bezeichnung: "Fest 4",
        zinsen: 0.59,
      },
      {
        bezeichnung: "Fest 5",
        zinsen: 0.62,
      },
      {
        bezeichnung: "Fest 6",
        zinsen: 0.75,
      },
      {
        bezeichnung: "Fest 7",
        zinsen: 0.80,
      },
      {
        bezeichnung: "Fest 8",
        zinsen: 0.83,
      },
      {
        bezeichnung: "Fest 9",
        zinsen: 0.86,
      },
      {
        bezeichnung: "Fest 10",
        zinsen: 0.91,
      },
      {
        bezeichnung: "Fest 11",
        zinsen: 0.96,
      },
      {
        bezeichnung: "Fest 12",
        zinsen: 1.02,
      },
      {
        bezeichnung: "Fest 13",
        zinsen: 1.48,
      },
      {
        bezeichnung: "Fest 14",
        zinsen: 1.54,
      },
      {
        bezeichnung: "Fest 15",
        zinsen: 1.40,
      },
      {
        bezeichnung: "LIBOR 1M",
        zinsen: 0.72,
      },
      {
        bezeichnung: "LIBOR 3M",
        zinsen: 0.65,
      },
      {
        bezeichnung: "LIBOR 6M",
        zinsen: 0.65,
      },
      {
        bezeichnung: "LIBOR 12M",
        zinsen: 0.71,
      },
      {
        bezeichnung: "Variabel",
        zinsen: 2.25,
      },
    ],
  });
}

seed();
