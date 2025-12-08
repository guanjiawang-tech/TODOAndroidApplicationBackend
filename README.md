# TODO List Application 使用说明

## 开发思路

本应用为安卓本地 TODO List 软件，主要特点如下：

- 数据存储：
  - 本地存储：所有 TODO 数据默认存储在 `data.json` 文件中，方便离线使用。
  - 在线同步：若用户登录，则会从 MongoDB 数据库中获取 TODO 数据，并缓存到本地 `data.json` 文件。
- 数据操作策略：
  - 增删改操作优先更新本地数据文件，再同步到数据库，减少后端访问次数。
  - 数据列表显示均在本地查询完成，提高响应速度。
- 技术选型：
  - 前端：Kotlin Android
  - 本地数据：JSON 文件存储
  - 后端：MongoDB 数据库
  - 网络访问：Node.js

## 运行方式

> 1. 下载或克隆项目：
>
>    前端项目：**[TODOAndroidApplication](https://github.com/guanjiawang-tech/TODOAndroidApplication)**
>
>    后端项目  **[TODOAndroidApplicationBackend](https://github.com/guanjiawang-tech/TODOAndroidApplicationBackend)**
>
> 2. 前端项目在 Android Studio 打开项目
>
>    1. 更新package com.example.todoapplication.data.api.Client文件的BASE_URL变量成自己本机的ipv4
>    2. 运行项目到测试机
>
> 3. 后端项目在Visual Studio Code 打开项目
>
>    1. 安装依赖
>
>       ```
>       npm init -y
>       
>       npm install express mongoose bcrypt jsonwebtoken cors dotenv
>       ```
>
>    2. 修改文件 .env 到本地数据库
>
>    3. 启动Node.js 项目 ：
>
>       ```
>       cd D:\...\CodeSpace\TODOAndroidApplicationBackend
>             
>       node server.js
>       ```
>
> 4. 安装 APK 并启动应用

## 操作说明

> - 新增 TODO：点击右上角 “添加” 按钮，填写标题、内容、截止日期等
> - 编辑 TODO：点击 TODO 项即可修改内容
> - 删除 TODO：在 TODO 项右滑删除
> - 筛选/排序：点击菜单选择状态/优先级/类型，切换升序/降序
> - 标记待办事项完成/未完成：点击左侧的选择框进行修改待办事项完成/未完成

## 创新加分点

> - 本地与联网协同的高可用性设计
>   - 用户输入的任务会优先存储到本地数据库。当设备离线或网络不稳定时，所有操作（新增、更新、删除）会记录到 `todo_sync_queue.json` 同步队列文件中。待网络恢复后，应用会自动按照操作顺序与服务器完成数据同步，保证数据一致性和可追溯性。
> - 滑动日期选择器的便捷交互设计
>   - 任务截止时间支持 **可滑动日期选择器**交互方式，更符合移动端习惯，比传统表单式日期输入更快速直观。
>
> - 重复任务机制支持
>   - 每条任务支持配置是否为重复任务：
>     - 若开启重复模式，任务将每日自动出现在待办列表中，不再需要设置具体截止日期。
>     - 重复任务每天的完成状态互不影响，即用户 *今日完成不影响明天显示*，保证长期任务的可持续性记录。

## 注意事项

- 本地数据文件位置：`<应用内部存储>/data.json` `<应用内部存储>/repeatList.json`
- 登录状态下，需要网络访问 MongoDB
- 游客登录下，只需要点击跳过登录就可以了
- 退出应用会丢失本地数据！

## 运行环境

- Node.js: v24.10.0
- JDK: 17.0.12
- 测试机: Android 15, OPPO Reno13, ColorOS
