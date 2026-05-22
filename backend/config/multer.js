import multer from "multer";
export const upload = multer({
    // Store in RAM
    storage: multer.memoryStorage(),
    // Avoid RAM overflow
    limits:{fileSize:10*1024*1024},
    // File validation
    fileFilter:(req,file,cb)=>{
        const allowedTypes=[
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ];
        if(allowedTypes.includes(file.mimetype)
        ){
            cb(null,true);
        }
        else{
            const err=new Error("Only JPG, PNG, PDF, PPT, PPTX allowed");
            err.status=400;
            cb(err,false);
        }
    }
});