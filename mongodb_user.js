const mongoose = require("mongoose");
const { UserModel } = require("./userModel");
const data = require("./userData.json");

mongoose.connect(
  "mongodb+srv://92cs93:Cs84961426@cluster0.kzoiugc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
mongoose.connection.once("open", async () => {
  console.log("数据库连接成功");
  console.log("Data to be inserted:", data);
  try {
    await UserModel.insertMany(data.users);
    console.log("数据插入成功");
  } catch (error) {
    console.error("操作失败:", error);
  } finally {
    mongoose.connection.close();
  }
});
