import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default prisma;

export { RisikoStufe, RueckzahlungsStatus } from "@prisma/client";
