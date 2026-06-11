import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
   const stream = cloudinary.uploader.upload_stream(
  {
    folder: "StudyVault",
    resource_type: "auto",
    public_id: req.file.originalname.split(".")[0],
    use_filename: true,
    unique_filename: true,
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