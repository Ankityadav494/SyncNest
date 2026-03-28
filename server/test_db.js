const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const collections = await db.collections();
  for (let c of collections) {
    if (c.collectionName === "users") {
      const indexes = await c.indexes();
      console.log(JSON.stringify(indexes, null, 2));
    }
  }
  process.exit();
}).catch(console.error);
