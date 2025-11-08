import mongoose from 'mongoose';

const careerSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  averageSalary: { type: Number, required: true },
  educationRequired: { type: String, required: true },
  skills: [String],
  relatedFields: [String],
});

const Career = mongoose.model('Career', careerSchema);
// Default export ka istemal karein
export default Career;