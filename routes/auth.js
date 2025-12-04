const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 登录
router.post("/login", async (req, res) => {
  console.log("收到 body =", req.body);
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });
  if (!user)
    return res.json({ success: false, message: "账号或密码错误" });

  user.lastLoginTime = new Date();
  await user.save();

  res.json({ success: true, message: "登录成功", userId: user._id });
});

module.exports = router;