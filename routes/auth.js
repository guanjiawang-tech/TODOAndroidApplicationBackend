const express = require("express");
const User = require("../models/User");
const Todo = require("../models/Todo");

const router = express.Router();

// login and register
router.post("/loginAndRegister", async (req, res) => {
  const { username, password } = req.body;

  // 先查是否存在账号
  let user = await User.findOne({ username });

  // 如果用户不存在 → 创建新账号
  if (!user) {
    user = new User({
      username,
      password,
      lastLoginTime: new Date()
    });

    await user.save();

    return res.json({
      code: true,
      msg: "账号不存在，已自动注册并登录成功",
      data: {
        userId: user._id,
        username: user.username
      }
    });
  }

  // 如果账号存在 → 验证密码
  if (user.password !== password) {
    return res.json({
      code: false,
      msg: "密码错误，请重试"
    });
  }

  // 密码正确 → 更新登录时间
  user.lastLoginTime = new Date();
  await user.save();

  res.json({
    code: true,
    msg: "登录成功",
    data: {
      userId: user._id,
      username: user.username
    }
  });
});

// Select todo List

router.post("/getTodoList", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.json({
      code: false,
      msg: "缺少 userId 参数"
    });
  }

  try {
    const todos = await Todo.find({ userId });
    // console.log("todos -> " + todos) 
    res.json({
      code: true,
      msg: "获取成功",
      data: todos
    });

  } catch (error) {
    console.error("查询失败:", error);
    res.json({
      code: false,
      msg: "服务器查询失败"
    });
  }

});



module.exports = router;