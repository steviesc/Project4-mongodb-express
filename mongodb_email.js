const mongoose = require("mongoose");
const { EmailModel } = require("./emailModel");
const data = require("./emailData.json");

// mongoose.connect("mongodb://127.0.0.1:27017/emaildata");
mongoose.connect(
  "mongodb+srv://92cs93:Cs84961426@cluster0.kzoiugc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
mongoose.connection.once("open", async () => {
  console.log("数据库连接成功");
  try {
    // await EmailModel.deleteMany({});
    // console.log("数据清空成功");

    // 插入数据
    await EmailModel.insertMany(data.emails);
    console.log("数据插入成功");

    // 检查插入的数据
    const insertedData = await EmailModel.find({});
    console.log("插入的数据:", insertedData);

    // 确认插入数据数量
    const count = await EmailModel.countDocuments();
    console.log(`数据库中有 ${count} 个文档`);

    if (count > 0) {
      // 更新数据
      const result = await EmailModel.updateMany(
        {},
        { $set: { isSelected: false } }
      );
      console.log("更新操作的结果:", result);

      // 打印 result 对象的所有属性
      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          console.log(`${key}: ${result[key]}`);
        }
      }

      // 检查更新的数据
      const updatedData = await EmailModel.find({});
      console.log("更新后的数据:", updatedData);
    } else {
      console.log("没有文档需要更新");
    }
  } catch (error) {
    console.error("操作失败:", error);
  } finally {
    // 关闭数据库连接
    mongoose.connection.close();
  }
});
mongoose.connection.on("error", () => {
  console.log("数据库连接失败");
});
mongoose.connection.on("close", () => {
  console.log("数据库连接关闭");
});
