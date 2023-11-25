import { Router } from 'express';
import aCollection from "../db/conn.mjs";
import { ObjectId } from "mongodb";

var router = Router();

router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  console.log("ID: " + req.params.id);
  let query = {_id: new ObjectId(req.params.id)};
  let result = await aCollection.findOne(query);
  if (!result) res.send("Not found").status(404);
  res.render('article', {imageSrc: `../image/${id}`, title: result.title, body: result.body})
});

export default router;
