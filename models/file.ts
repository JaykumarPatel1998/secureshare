import mongoose, { Schema, model } from "mongoose";

const fileSchema = new Schema({
  fileName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fileUrl: {
    type: String,
  },
  size: {
    type: Number
  },
  bucket: {
    type: String,
    default: process.env.S3_BUCKET
  },
  key: {
    type: String,
  },
  urlExpiryDate: {
    type: Date,
  }
});

const File = mongoose.models.files || model("files", fileSchema);
export default File
