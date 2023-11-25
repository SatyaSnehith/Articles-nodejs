import { Router } from 'express';
import aCollection from "../db/conn.mjs";
import { ObjectId } from "mongodb";

var router = Router();

/* GET users listing. */
router.get('/:id', async (req, res, next) => {
    let query = {_id: new ObjectId(req.params.id)};
    let result = await aCollection.findOne(query);
    console.log("ID: " + req.params.id);
    console.log(typeof result.image);
    if(!result) {
        res.json({error: "Not found"}).status(400)
        res.end()
        return
    }
    res.end(result.image)
    // result.image.pipe(res);
});

export default router;
