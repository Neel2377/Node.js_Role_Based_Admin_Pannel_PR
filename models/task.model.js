const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userTbl",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userTbl",
      required: true,
    },
    attachments: [String],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "userTbl" },
        text: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model("taskTbl", taskSchema);
module.exports = Task;
