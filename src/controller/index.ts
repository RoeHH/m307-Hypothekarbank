import * as express from 'express';
import prisma from '../model/db';

let router = express.Router();

router.get('/', async (req, res) => {
    res.render('index', { users: await prisma.kunde.findMany({}) });
});

export default router;