import express from 'express';
import multer from 'multer';
import { uploadImage, getImages } from '../controllers/imageController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporarily store files before Cloudinary upload

// ✅ Upload Route (Uses Multer Middleware)
router.post('/upload', upload.single('image'), uploadImage);

// ✅ Get Images Route
router.get('/:employeeId', getImages);

export default router;
