import mongoose from "mongoose";

const sendPostSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    privacy: {
      type: String,
      required: true,
    },
    programmingLanguage: {
      type: String,
      required: true, // Fixed typo: "require" -> "required"
    },
    projectCode: {
      type: String,
      required: true, // Fixed typo: "require" -> "required"
    },
    projectName: {
      type: String,
      required: true, // Fixed typo: "require" -> "required"
    },
    likes: {
      type: Number,
      default: 0, // Added default value
    },
    likedBy: [{ // Added likedBy array to track who liked the post
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [{ // Added comments support
      text: {
        type: String,
        required: true
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

const SendPost = mongoose.model("Posts", sendPostSchema);

export default SendPost;