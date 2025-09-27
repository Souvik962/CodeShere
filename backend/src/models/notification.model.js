import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["code_share", "announcement", "update", "reminder", "appreciation", "achievement"],
        default: "code_share",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;