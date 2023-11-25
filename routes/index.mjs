import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

// Get a list of 50 posts
router.get("/", async (req, res) => {
  res.render('addarticle')
});

export default router;