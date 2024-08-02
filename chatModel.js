const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  isTwoStepAuthVerificationEnabled: { type: Boolean, default: false },
  isNotificationsOn: { type: Boolean, default: true },
});

const profileUserSchema = new Schema({
  id: { type: Number, required: true },
  avatar: { type: String },
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  about: { type: String },
  status: { type: String },
  settings: settingsSchema,
});

const contactSchema = new Schema({
  id: { type: Number, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  about: { type: String },
  avatar: { type: String },
  avatarColor: { type: String },
  status: { type: String },
});
const feedbackSchema = new Schema({
  isSent: { type: Boolean, default: true },
  isDelivered: { type: Boolean, default: true },
  isSeen: { type: Boolean, default: true },
});

const messageSchema = new Schema({
  message: { type: String, required: true },
  time: { type: Date, required: true },
  senderId: { type: Number, required: true },
  feedback: feedbackSchema,
});

const chatSchema = new Schema({
  id: { type: Number, required: true },
  userId: { type: Number, required: true },
  unseenMsgs: { type: Number, default: 0 },
  chat: [messageSchema],
});

const ChatModelSchema = new Schema({
  profileUser: profileUserSchema,
  contacts: [contactSchema],
  chats: [chatSchema],
});

const ChatModel = mongoose.model("chats", ChatModelSchema);

module.exports = { ChatModel };
