const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  try {
    await db.collection("users").dropIndex("username_1");
    console.log("username_1 index dropped successfully");
  } catch (err) {
    console.error("Error dropping index:", err);
  }
  process.exit();
}).catch(console.error);
