const mongoose = require("mongoose");

const User = mongoose.model("User", {
  account: {
    firstName: {
      require: true,
      type: String,
    },
    lastName: {
      require: true,
      type: String,
    },
    email: {
      require: true,
      unique: true,
      type: String,
    },
    psedo: {
      require: true,
      type: String,
    },
  },
  tasks: {
    type: Array,
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  },
  temporaryToken: String,
  timestamp: Number,
  token: String,
  salt: String,
  hash: String,
});

module.exports = User;
