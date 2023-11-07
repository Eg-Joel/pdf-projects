const User = require("../Models/user")
const Pdf = require("../Models/pdf")
const fs = require("fs");
const isPDF = require("is-pdf-valid");
 

exports.pdfUpload = async (req, res, next) => {
  const filename = req.file.filename
  const userId = req.user.id;
  const title = req.body.title;
    try {
      const fileBuffer = fs.readFileSync(req.file.path);
      const isFilePDF = isPDF(fileBuffer);
      
      if (isFilePDF) {
      let newpdf = new Pdf({
        pdf:filename,
        title: title,
        userId: userId
      })
       await newpdf.save()
       const user = await User.findById(userId);
       if (!user) {
         return next(errorHandler(404, "User not found!"));  
       }
       user.pdfs.push(newpdf._id); 
    await user.save();
      res.status(201).json("pdf upload successfully");
    } else {
      return next(errorHandler(404, "Uploaded file is not a valid PDF")); 
    } 
    } catch (error) {
      next(error);
    }
  };

  exports.getPdf = async( req, res, next) =>{
    const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found!"));  
    }
    const userPdfs = await Pdf.find({ userId: userId });
    res.status(201).json({ data: userPdfs });
  } catch (error) {
    next(error);
  }

  }

