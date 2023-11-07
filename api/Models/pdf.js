const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema(
    {
      pdf: { type: String, required: true },
      title: {type: String, required: true ,},
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Pdf", pdfSchema);