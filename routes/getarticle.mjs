import { Router } from 'express';
import aCollection from "../db/conn.mjs";
var router = Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let query = {_id: ObjectId(req.params.id)};
  let result = await aCollection.findOne(query);
  if (!result) res.send("Not found").status(404);
  res.json({title: result.title, body: result.body})
});

export default router;
