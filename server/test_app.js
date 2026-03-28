const mongoose = require('mongoose');
require('dotenv').config();
const Application = require('./models/Application');
const Project = require('./models/Project');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const applications = await Application.find().populate({
      path: 'project',
      populate: { path: 'owner', select: 'name email' }
    });
    require('fs').writeFileSync('apps.json', JSON.stringify(applications, null, 2));
    console.log("Success");
  } catch (err) {
    require('fs').writeFileSync('err.txt', String(err.stack));
  }
  process.exit();
}).catch(console.error);
