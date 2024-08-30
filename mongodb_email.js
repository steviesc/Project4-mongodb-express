const mongoose = require("mongoose");
const { EmailModel } = require("./emailModel");
const data = require("./emailData.json");

// mongoose.connect("mongodb://127.0.0.1:27017/emaildata");
mongoose.connect(
  "mongodb+srv://92cs93:Cs84961426@cluster0.kzoiugc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
mongoose.connection.once("open", async () => {
  console.log("conenction successful");
  try {
    // await EmailModel.deleteMany({});
    // console.log("deleted");

    await EmailModel.insertMany(data.emails);
    console.log("inserted");

    const insertedData = await EmailModel.find({});
    console.log("data inserted:", insertedData);

    const count = await EmailModel.countDocuments();
    console.log(`db has ${count} docs`);

    if (count > 0) {
      const result = await EmailModel.updateMany(
        {},
        { $set: { isSelected: false } }
      );
      console.log("data updated", result);

      for (const key in result) {
        if (result.hasOwnProperty(key)) {
          console.log(`${key}: ${result[key]}`);
        }
      }

      const updatedData = await EmailModel.find({});
      console.log("data updated:", updatedData);
    } else {
      console.log("no docs to update");
    }
  } catch (error) {
    console.error("error:", error);
  } finally {
    mongoose.connection.close();
  }
});
mongoose.connection.on("error", () => {
  console.log("connection error");
});
mongoose.connection.on("close", () => {
  console.log("database closed");
});
