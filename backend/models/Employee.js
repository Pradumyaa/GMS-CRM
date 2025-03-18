import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const imageSchema = new mongoose.Schema({
    data: Buffer, // Binary data of the image
    contentType: String, // Mime type of the image
});
const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false,
        sparse: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    resume: {
        type: String,
        required: false
    },
    images: [imageSchema],
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: v => /\d{10}/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Resigned', 'Absconded'],
        default: 'Active'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
employeeSchema.methods.verifyPassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

employeeSchema.methods.setCredentials = async function (employeeId, password) {
    this.employeeId = employeeId;
    this.password = password;
    await this.save();
};

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
