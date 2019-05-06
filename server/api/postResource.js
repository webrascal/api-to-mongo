import express from 'express';
const router = express.Router();
import cors from 'cors';
import Generic from "../../db/models";
import logger from '../../logger';

router.post('/:resource', cors(), (req, res) => {
    logger.info(`Received POST to ${req.params.resource}`);
    logger.debug(`Received data ` + JSON.stringify(req.body));
    const new_generic = new Generic({
        name: req.params.resource,
        created_at: new Date().getTime(),
        data: req.body
    });
    logger.debug('About to save Generic', new_generic);
    new_generic.save((err, generic) => {
        if (err)
            res.send(err);
        res.json(generic);
        logger.debug('Saved generic to db', generic);
    });
});

export default router;
