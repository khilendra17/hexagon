import { Router } from 'express';
import multer from 'multer';
import { analyzeFrame } from '../controllers/aiProxyController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/analyze-frame
router.post('/', upload.single('frame'), analyzeFrame);

export default router;
