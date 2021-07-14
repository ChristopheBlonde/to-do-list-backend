const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
  text: String,
  checkBox: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Task;
