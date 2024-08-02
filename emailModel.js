const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 定义附件子模式
const AttachmentSchema = new Schema({
  fileName: { type: String, required: true },
  thumbnail: { type: String, required: true },
  url: { type: String, default: "" },
  size: { type: String, required: true },
});

// 定义发件人和收件人子模式
const PersonSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  { _id: false }
);

const RecipientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
);

// 定义回复子模式
const ReplySchema = new Schema(
  {
    id: { type: Number, required: true },
    from: { type: PersonSchema, required: true },
    to: [RecipientSchema],
    subject: { type: String, required: true },
    cc: [String],
    bcc: [String],
    message: { type: String, required: true },
    attachments: [AttachmentSchema],
    isStarred: { type: Boolean, default: false },
    labels: [String],
    time: { type: Date, required: true },
    replies: [this], // 递归引用，适用于嵌套回复
    folder: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { _id: false }
);

// 定义主模式
const EmailSchema = new Schema({
  id: { type: Number, required: true },
  from: { type: PersonSchema, required: true },
  to: [RecipientSchema],
  subject: { type: String, required: true },
  cc: [String],
  bcc: [String],
  message: { type: String, required: true },
  attachments: [AttachmentSchema],
  isStarred: { type: Boolean, default: false },
  labels: [String],
  time: { type: Date, required: true },
  replies: [ReplySchema],
  folder: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
});

// 创建模型对象
// const BookModel = mongoose.model("books", BookSchema);
const EmailModel = mongoose.model("emails", EmailSchema);
module.exports = { EmailModel };
