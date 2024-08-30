const mongoose = require("mongoose");
const { UserModel } = require("./userModel");
const data = require("./userData.json");

mongoose.connect(
  "mongodb+srv://92cs93:Cs84961426@cluster0.kzoiugc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
mongoose.connection.once("open", async () => {
  console.log("connection successful");
  console.log("Data to be inserted:", data);
  try {
    await UserModel.insertMany(data.users);
    console.log("data inserted");
  } catch (error) {
    console.error("error:", error);
  } finally {
    mongoose.connection.close();
  }
});
