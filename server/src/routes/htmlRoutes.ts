import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router, Request, Response } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// GET / -- retrieve client root index.html
router.get('/', (_req: Request, rsp: Response) => {
    rsp.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

export default router;
