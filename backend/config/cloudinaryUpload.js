import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "StudyVault",
        resource_type: "raw",
        public_id: originalname
          ? originalname.split(".")[0]
          : undefined,
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