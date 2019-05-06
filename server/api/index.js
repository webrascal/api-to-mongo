import express from 'express';
const router = express.Router();
import cors from 'cors';
import markdown from "markdown";
import fs from 'fs';
import path from 'path';
import logger from '../../logger';

router.get('/', cors(), (req, res) => {
    logger.info('Received call to index');
    const readme = fs.readFileSync(path.join(__dirname, '../../README.md'), 'utf8');
    logger.debug(`Loaded readme file to variable, with contents: ${readme}`);
    const prepend = '<html><body>';
    const style = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"><link href="local.css" rel="stylesheet">';
    const append = '</body></html>';
    const html = prepend + style + markdown.markdown.toHTML(readme) + append;
    res.send(html);
});

export default router;
