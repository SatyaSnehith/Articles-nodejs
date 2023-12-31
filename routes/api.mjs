import express from "express";
import aCollection from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import formidable from 'formidable';
import fs from "fs";
import { _16mb, validateFields } from './add.mjs'

const router = express.Router();

router.get("/all", async (req, res) => {
  let result = await aCollection
    .find({})
    .sort({'timestamp': -1})
    .toArray()
  if (!result) res.send("Not found").status(404);
  const articles = []
  for(const item of result) {
      articles.push({
          id: item._id,
          title: item.title,
          body: item.body.substring(0, Math.min(item.body.length, 50)) + "...",
      })
  }
  res.json(articles)
});

router.get('/get/:id', async (req, res, next) => {
    const id = req.params.id
    console.log("ID: " + req.params.id);
    let query = {_id: new ObjectId(req.params.id)};
    let result = await aCollection.findOne(query);
    if (!result) res.send("Not found").status(404);
    res.json({imageSrc: `../image/${id}`, title: result.title, body: result.body})
});

router.post("/add", async (req, res) => {
    var form = formidable({});
    form.parse(req, async (err, fields, files) => {
        if(!files.image || !fields.title || !fields.body) {
            res.json({ error: "Add title, image and body" }).status(400)
            res.end()
            return
        }
        const image = files.image[0]
        const title = fields.title[0]
        const body = fields.body[0]
        const error = validateFields(title, body, image)
        if (error) {
            res.json({ error: error }).status(400)
            res.end()
            return
        }
        let buffer = fs.readFileSync(image.filepath);
        const result = await aCollection.insertOne({
            title: title,
            body: body,
            imageMimeType: image.mimetype,
            timestamp: new Date(),
            image: buffer
        })
        res.json({id: result.insertedId});
        res.end();
    });
});



export default router;