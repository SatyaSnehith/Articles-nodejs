import express from "express";
import aCollection from "../db/conn.mjs";
import formidable from 'formidable';

const router = express.Router();

router.post("/", async (req, res) => {
    var form = formidable({});
    form.parse(req, async (err, fields, files) => {
        const image = files.image[0]
        const title = fields.title[0]
        const body = fields.body[0]
        const error = validateFields(title, body, image)
        if (error) {
            res.json({ error: error }).status(400)
            res.end()
            return
        }
        aCollection.insertOne({
            title: title,
            body: body,
            image: image
        })
        res.json({ message: 'File uploaded' });
        res.end();
    });
});

const _16mb = 16 * 1024 * 1024;

function validateFields(title, body, image) {
    const titleError = validateText(title, "Title", 0, 20)
    if (titleError) return titleError

    const bodyError = validateText(body, "Body", 0, 200)
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

export default router;