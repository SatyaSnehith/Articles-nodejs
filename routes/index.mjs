import express from "express";
import aCollection from "../db/conn.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
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
          link: "/get/" + item._id
      })
  }
  res.render('viewall', {articles: articles})
});

export default router;