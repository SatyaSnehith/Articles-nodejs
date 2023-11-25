import { Router } from 'express';
import aCollection from "../db/conn.mjs";

var router = Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
    let result = await aCollection.find({}).toArray()
    if (!result) res.send("Not found").status(404);
    const articles = []
    for(const item of result)
        articles.push({
            id: item._id,
            title: item.title,
            body: item.body,
        })
    res.json(articles)
});

export default router;
