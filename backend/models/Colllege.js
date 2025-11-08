const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  courses: [String]
});

module.exports = mongoose.model('College', collegeSchema);