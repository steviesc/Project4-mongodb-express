const express = require("express");
const { EmailModel } = require("./emailModel");
const { ChatModel } = require("./chatModel");
const { UserModel } = require("./userModel");
const mongoose = require("mongoose");
const cors = require("cors");
const dataOrg = require("./emailData.json");

// mongoose.connect("mongodb://127.0.0.1:27017/emaildata", {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// });

mongoose.connect(
  "mongodb+srv://92cs93:Cs84961426@cluster0.kzoiugc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const app = express();
app.use(cors()); //解决跨域问题
app.use(express.json());

// 根路由，获取所有邮件数据
app.get("/", async (req, res) => {
  try {
    const dataAll = await EmailModel.find();
    console.log(dataAll); // 打印查询结果进行调试
    res.send(dataAll);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/folder/:folder", async (req, res) => {
  const folder = req.params.folder;
  console.log(folder);
  if (folder === "starred") {
    EmailModel.find({
      $or: [{ isStarred: true }, { "replies.isStarred": true }],
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  } else {
    EmailModel.find({
      folder: folder,
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }
});

app.get("/label/:label", async (req, res) => {
  const label = req.params.label;
  EmailModel.find({
    $or: [{ labels: label }, { "replies.labels": label }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.get("/id/:id", async (req, res) => {
  const id = req.params.id;
  EmailModel.find({
    id: id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});
app.get("/query/:folderOrLabel/:query", async (req, res) => {
  const folderOrLabel = req.params.folderOrLabel;
  const query = req.params.query;
  EmailModel.find({
    $and: [
      {
        $or: [{ labels: folderOrLabel }, { folder: folderOrLabel }],
      },
      {
        $or: [
          { "from.name": { $regex: query, $options: "i" } },
          { "from.email": { $regex: query, $options: "i" } },
          { "to.name": { $regex: query, $options: "i" } },
          { "to.email": { $regex: query, $options: "i" } },
          { subject: { $regex: query, $options: "i" } },
          { message: { $regex: query, $options: "i" } },
          { "attachments.fileName": { $regex: query, $options: "i" } },
          { "attachments.thumbnail": { $regex: query, $options: "i" } },
          { "attachments.url": { $regex: query, $options: "i" } },
          { labels: { $regex: query, $options: "i" } },
          { "replies.subject": { $regex: query, $options: "i" } },
          { "replies.message": { $regex: query, $options: "i" } },
        ],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});

app.get("/reset", async (req, res) => {
  try {
    // 删除现有数据
    await EmailModel.deleteMany({});
    // 插入原始数据
    await EmailModel.insertMany(dataOrg.emails);
    res.send(dataOrg);
  } catch (error) {
    res.status(500).send({ message: "Error resetting database", error });
  }
});

app.post("/updateMail", async (req, res) => {
  const { emailIds, dataToUpdate } = req.body;
  console.log(emailIds, dataToUpdate);
  try {
    await EmailModel.updateMany(
      { id: { $in: emailIds } },
      { $set: dataToUpdate }
    );
    res.status(200).json({ message: "Emails updated successfully" });
  } catch (error) {
    console.error("Error updating emails:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profileuser", async (req, res) => {
  try {
    const data = await ChatModel.findOne({}, "profileUser");
    console.log(data); // 打印查询结果进行调试
    res.send(data);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/chats", async (req, res) => {
  try {
    const data = await ChatModel.find();
    console.log(data); // 打印查询结果进行调试
    res.send(data);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/login", async (req, res) => {
  try {
    const data = await UserModel.find();
    console.log(data); // 打印查询结果进行调试
    res.send(data);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  const role = "user";
  console.log(email, password, username);
  try {
    const maxUser = await UserModel.findOne().sort({ id: -1 }).exec();
    const newId = maxUser ? maxUser.id + 1 : 1; // 如果没有用户，默认 id 为 1
    const newUser = new UserModel({
      id: newId,
      email,
      password,
      username,
      role,
      // fullName,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
