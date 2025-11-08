import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Assessment' },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 100 },
    takenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
