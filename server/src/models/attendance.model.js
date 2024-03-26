import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: "absent"
    }
});

export const Attendance  = mongoose.model('Attendance', attendanceSchema);