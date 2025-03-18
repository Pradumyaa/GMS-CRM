import { db, admin } from '../config/firebase.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Store files temporarily before Cloudinary upload

// Upload Image to Cloudinary & Store URL in Firestore
export const uploadImage = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // ✅ Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `employees/${employeeId}`,  // Organizes images in Cloudinary
    });

    const imageUrl = result.secure_url;

    // ✅ Remove temp file after upload
    fs.unlinkSync(file.path);

    // ✅ Get Firestore reference (Correct Path)
    const employeeRef = db.doc(`/test/employees/data/${employeeId}`);
    const employeeDoc = await employeeRef.get();

    console.log(`Firestore Doc Check for ${employeeId}: `, employeeDoc.exists); // Debugging log

    // ✅ If the document doesn't exist, create it
    await employeeRef.set(
      { images: admin.firestore.FieldValue.arrayUnion(imageUrl) },
      { merge: true }
    );

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};



// Get Image URLs for an Employee
export const getImages = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employeeDoc = await db.doc(`/test/employees/data/${employeeId}`).get();


    if (!employeeDoc.exists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employeeData = employeeDoc.data();
    res.status(200).json({ images: employeeData.images || [] });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving images', error });
  }
};
