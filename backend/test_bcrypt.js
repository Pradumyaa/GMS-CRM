import mongoose from 'mongoose';
import Employee from './models/Employee.js'; // Adjust path as needed

const updateMissingTimestamps = async () => {
    await mongoose.connect('mongodb://localhost:27017/yourDatabaseName', { useNewUrlParser: true, useUnifiedTopology: true });

    const employees = await Employee.find({ createdAt: { $exists: false } });

    for (let employee of employees) {
        employee.createdAt = new Date();
        await employee.save();
    }

    console.log('Timestamps updated successfully!');
    mongoose.disconnect();
};

updateMissingTimestamps().catch(console.error);
