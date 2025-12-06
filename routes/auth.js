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

// update Todo 
router.patch("/updateTodo", async (req, res) => {
  const { todoId, updates } = req.body;

  if (!todoId) {
    return res.json({
      code: false,
      msg: "缺少 todoId 参数"
    });
  }

  try {
    // 过滤掉 undefined 和 null 字段，只更新传入的字段
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(filteredUpdates).length === 0) {
      return res.json({
        code: false,
        msg: "没有可更新的字段"
      });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { $set: filteredUpdates },
      { new: true } // 返回更新后的文档
    );

    if (!updatedTodo) {
      return res.json({
        code: false,
        msg: "Todo 未找到"
      });
    }

    res.json({
      code: true,
      msg: "更新成功",
      data: updatedTodo
    });

  } catch (error) {
    console.error("更新失败:", error);
    res.json({
      code: false,
      msg: "服务器错误，更新失败"
    });
  }
});

// delete Todo
router.post("/deleteTodo", async (req, res) => {
  const { todoId } = req.body;

  if (!todoId) {
    return res.json({
      code: false,
      msg: "缺少 todoId 参数"
    });
  }

  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.json({
        code: false,
        msg: "Todo 未找到或已经被删除"
      });
    }

    res.json({
      code: true,
      msg: "删除成功",
      data: deletedTodo
    });

  } catch (error) {
    console.error("删除失败:", error);
    res.json({
      code: false,
      msg: "服务器错误，删除失败"
    });
  }
});

// insert Todo 
router.post("/insertTodo", async (req, res) => {
  const {
    userId,
    title,
    content,
    deadline,
    status = 0,
    priority = 1,
    repeatType = 0,
    classify
  } = req.body;

  if (!userId || !title || !content) {
    return res.json({
      code: false,
      msg: "缺少必要参数 (userId, title, content)"
    });
  }

  try {
    const newTodo = new Todo({
      userId,
      title,
      content,
      createdAt: new Date(),
      deadline: deadline ? new Date(deadline) : null,
      status,
      priority,
      repeatType,
      classify
    });

    const savedTodo = await newTodo.save();

    res.json({
      code: true,
      msg: "新增 Todo 成功",
      data: savedTodo
    });
  } catch (error) {
    console.error("新增 Todo 失败:", error);
    res.json({
      code: false,
      msg: "服务器错误，新增 Todo 失败"
    });
  }
});


module.exports = router;