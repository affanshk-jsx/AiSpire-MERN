import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    // Reference to user who booked the appointment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Store some user info for easier query/debugging
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },

    // Appointment details
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true, // e.g. "14:30"
    },
    mode: {
      type: String,
      enum: ['online', 'offline', 'phone', 'video'],
      default: 'online',
    },
    notes: {
      type: String,
    },

    // Status managed by admin or user
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Optional: auto-fill name/email when creating appointment
appointmentSchema.pre('save', function (next) {
  if (this.isNew && this.user && (!this.name || !this.email)) {
    // This only works if we populate user in controller
    // but it's safe to keep for fallback logic
    next();
  } else {
    next();
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
