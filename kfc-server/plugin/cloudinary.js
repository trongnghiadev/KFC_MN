const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.upload = (fileStream, folder, setName) => {
    return new Promise((resolve) => {
        let stream = cloudinary.uploader.upload_stream({
          public_id: setName,
          folder: folder,
          overwrite: true
        },
            (error, result) => {
              if (result) {
                resolve(result.url);
              } else {
                reject(error);
              }
            }
          );

          fileStream.pipe(stream);
    })
}