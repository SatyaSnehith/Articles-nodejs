import { Router } from 'express';
import aCollection from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { Buffer } from "buffer";

var router = Router();

router.get('/:id', async (req, res, next) => {
    let query = {_id: new ObjectId(req.params.id)};
    let result = await aCollection.findOne(query);
    if(!result) {
        res.json({error: "Not found"}).status(400)
        res.end()
        return
    }
    res.writeHead(200, [['Content-Type', result.imageMimeType]]);
    res.end(result.image.buffer)
    // result.image.pipe(res);
});

export default router;
