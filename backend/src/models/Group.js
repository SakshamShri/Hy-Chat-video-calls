import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxLength: 100
    },
    description: { 
      type: String, 
      default: "",
      maxLength: 500
    },
    admin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    members: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }],
    lastMessage: {
      type: String,
      default: ""
    },
    unreadCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Index for better query performance
groupSchema.index({ members: 1 });
groupSchema.index({ admin: 1 });

const Group = mongoose.model("Group", groupSchema);

export default Group;
