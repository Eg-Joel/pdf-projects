const { pdfUpload, getPdf, extractPdf } = require("../controllers/pdfController");
const verifyToken = require("../utils/verifyToken");

const router = require("express").Router()

const multer = require("multer");

const storage = multer.diskStorage({
  
    destination: function (req, file, cb) {
      cb(null, "./files");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });
 

  const upload = multer({ storage: storage });

router.post("/upload",upload.single("file"),verifyToken,pdfUpload)

router.get("/getPdf",verifyToken,getPdf)


module.exports = router;