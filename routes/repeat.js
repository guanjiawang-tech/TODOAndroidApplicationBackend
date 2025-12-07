const express = require("express");
const RepeatList = require("../models/RepeatList");
const router = express.Router();

// 添加或更新重复记录
router.post("/repeatList", async (req, res) => {
  const { todoId, userId, date } = req.body;

  if (!todoId || !date || !userId) {
    return res.status(400).json({ message: "传入参数不正确" });
  }

  try {
    let record = await RepeatList.findOne({ todoId });

    // TODO: 如果不存在 → 创建新的
    if (!record) {
      record = new RepeatList({
        todoId,
        userId,
        date: [date]  // 存入新 date
      });
      await record.save();
      return res.json({
        message: "新记录已创建",
        data: record
      });
    }

    // TODO: 存在 → 判断 date 是否已经存在
    const index = record.date.indexOf(date);

    if (index > -1) {
      // 已存在 → 删除它
      record.date.splice(index, 1);
    } else {
      // 不存在 → 添加进去
      record.date.push(date);
    }

    await record.save();

    res.json({
      message: "更新成功",
      data: record
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误", error: err.message });
  }
});

// 查询所有重复记录
router.get("/getAllRepeatList", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      code: false,
      message: "缺少 userId 参数"
    });
  }

  try {
    const allRecords = await RepeatList.find({ userId }); // 直接查全部

    res.json({
      message: "查询成功",
      data: allRecords
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "服务器错误", error: err.message });
  }
});

module.exports = router;