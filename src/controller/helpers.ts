import { RisikoStufe, RueckzahlungsStatus } from "../model/db";

export function getRisikoStufeFromString(
  risk: any,
): RisikoStufe | Error {
  switch (risk.charAt(0).toLowerCase() + risk.split(" ").join("").slice(1)) {
    case "sehrTief":
      return RisikoStufe.sehrTief;
    case "tief":
      return RisikoStufe.tief;
    case "normal":
      return RisikoStufe.normal;
    case "hoch":
      return RisikoStufe.hoch;
    case "sehrHoch":
      return RisikoStufe.sehrHoch;
  }
  return new Error("Risikostufe nicht gefunden");
}

export function getRueckzahlungsstatusFromString(
  status: string,
): RueckzahlungsStatus | Error {
  switch (status.toLowerCase()) {
    case "offen":
      return RueckzahlungsStatus.offen;
    case "bezahlt":
      return RueckzahlungsStatus.bezahlt;
  }
  return new Error("Staus nicht gefunden");
}

export function addRiskToDate(date: Date, risikostufe: RisikoStufe): Date {
  switch (risikostufe) {
    case RisikoStufe.sehrTief:
      return new Date(date.getTime() + (840 * 24 * 60 * 60 * 1000));
    case RisikoStufe.tief:
      return new Date(date.getTime() + (660 * 24 * 60 * 60 * 1000));
    case RisikoStufe.normal:
      return new Date(date.getTime() + (480 * 24 * 60 * 60 * 1000));
    case RisikoStufe.hoch:
      return new Date(date.getTime() + (360 * 24 * 60 * 60 * 1000));
    case RisikoStufe.sehrHoch:
      return new Date(date.getTime() + (240 * 24 * 60 * 60 * 1000));
  }
}
