import multer, { diskStorage } from "multer";
import { extname } from "path";

// Multer config
export default multer({
  storage: diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".JPG" &&
      ext !== ".JPEG" &&
      ext !== ".PNG"
    ) {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
