import express from 'express';
const router = express.Router();
import cors from 'cors';
import logger from '../../logger';

router.get('/', cors(), (req, res) => {
    logger.info('Received call to health check');
    res.send(true);
});

export default router;
