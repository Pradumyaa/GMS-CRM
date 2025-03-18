import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dndnj5e68',  // 🔥 Replace with your Cloudinary Cloud Name
  api_key: '939562661941516',  // 🔥 Replace with your API Key
  api_secret: 'E6EZ_309XyjXP1z4ULBzpwnjMoU',  // 🔥 Replace with your API Secret
  secure: true,  // Ensures HTTPS URLs
});

export default cloudinary;
