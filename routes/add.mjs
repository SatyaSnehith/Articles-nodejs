import express from "express";
import aCollection from "../db/conn.mjs";
import formidable, {errors as formidableErrors}  from 'formidable';
import fs from "fs";

const addRouter = express.Router();

addRouter.get("/", (req, res) => {
    res.render('addarticle')
})

addRouter.post("/", async (req, res) => {
    var form = formidable({
        maxFields: 3,
        maxFileSize: _16mb
    });
    let fields;
    let files;
    try {
        [fields, files] = await form.parse(req);
    } catch (err) {
        console.error(err);
        res.status(err.httpCode || 400).json({ error: err.message });
        res.end();
        return
    }
    if(!files.image || !fields.title || !fields.body) {
        res.status(400).json({ error: "Add title, image and body" })
        res.end()
        return
    }
    const image = files.image[0]
    const title = fields.title[0]
    const body = fields.body[0]
    const error = validateFields(title, body, image)
    if (error) {
        res.status(400).json({ error: error })
        res.end()
        return
    }
    let buffer = fs.readFileSync(image.filepath);
    await aCollection.insertOne({
        title: title,
        body: body,
        imageMimeType: image.mimetype,
        timestamp: new Date(),
        image: buffer
    })
    res.redirect('/');
    res.end();
});

const _16mb = 16 * 1024 * 1024;

function validateFields(title, body, image) {
    const titleError = validateText(title, "Title", 0, 100)
    if (titleError) return titleError

    const bodyError = validateText(body, "Body", 0, 1000)
    if (bodyError) return bodyError

    if (!image) return "Image not found in the request"
    if (image.size > _16mb) return "Image size must be less than 16 MB"
    return null
}

function validateText(text, type, minCount, maxCount) {
    if (text) {
        const len = text.length
        if (len < minCount) return `${type} must have more than ${minCount} characters`
        if (len > maxCount) return `${type} must have less than ${maxCount} characters`
    } else {
        return type + " not found in the request"
    }
    return null
}

export { addRouter, _16mb, validateFields, validateText };