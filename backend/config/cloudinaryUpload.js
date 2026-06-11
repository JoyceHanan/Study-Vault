import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "StudyVault",
        resource_type: "raw",
      },
      (err, result) => {
        if (err) {
          console.log("UPLOAD ERROR:", err);
          return reject(err);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};