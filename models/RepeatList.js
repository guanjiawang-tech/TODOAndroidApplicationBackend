const mongoose = require("mongoose");

const RepeatListSchema = new mongoose.Schema({
  todoId: { type: String, required: true },
  userId: String,
  date: { type: [String], default: [] }, // 存日期数组
});

module.exports = mongoose.model("RepeatList", RepeatListSchema, "repeatList");