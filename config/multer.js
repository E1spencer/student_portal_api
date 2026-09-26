import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage
});

export default upload;

// multer is an express/node.js middleware for handling multipart/form-data, which is primarily used for uploading files. In this code snippet, we are configuring multer to store uploaded files in the 'uploads' directory and to generate a unique filename for each uploaded file by appending the current timestamp to the original filename. The `upload` middleware can then be used in routes to handle file uploads.  