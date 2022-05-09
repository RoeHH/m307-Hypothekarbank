import * as express from 'express';
import prisma from '../model/db';

let router = express.Router();

router.get('/:id', async (req, res) => {
    res.send(await prisma.hypothek.findUnique({where:{id: Number(req.params.id)}}));
});

export default router;