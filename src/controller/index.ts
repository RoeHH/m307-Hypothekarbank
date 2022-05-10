import { Hypothek } from '@prisma/client';
import * as express from 'express';
import prisma from '../model/db';

let router = express.Router();  

router.get('/', async (req, res) => {
    res.render('index', { hypotheken: await (await prisma.hypothek.findMany({})).sort((a: Hypothek,b: Hypothek) => a.rueckzahlungsDatum.getMilliseconds() - b.rueckzahlungsDatum.getMilliseconds()) });
});

export default router;