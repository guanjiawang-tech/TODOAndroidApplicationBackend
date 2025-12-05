const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  deadline: Date,
  status: { type: Number, default: 0 }, // 0 未完成 1 完成
  priority: { type: Number, default: 1 }, // 1低 2普通 3紧急 4最高
  repeatType: { type: Number, default: 0 } // 0 不重复, 1每天
});

module.exports = mongoose.model("Todo", TodoSchema, "todos");