const mongoose = require("mongoose");
const { ChatModel } = require("./chatModel");
const data = require("./chatData.json");

// mongoose.connect("mongodb://127.0.0.1:27017/chatdata");
mongoose.connect(
  "mongodb+srv://92cs93:Cs84961426@cluster0.kzoiugc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
mongoose.connection.once("open", async () => {
  console.log("数据库连接成功");

  console.log("Data to be inserted:", data);

  try {
    await ChatModel.insertMany(data);
    console.log("数据插入成功");
  } catch (error) {
    console.error("操作失败:", error);
  } finally {
    mongoose.connection.close();
  }
});
