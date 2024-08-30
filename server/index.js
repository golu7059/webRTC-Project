import { server } from './app.js';
import cloudinary from 'cloudinary'

const PORT = process.env.PORT || 5000;

// Cloudinary configuration 
cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
