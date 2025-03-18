import { sendWelcomeEmail } from '../utils/emailTransporter.js';
import bcrypt from 'bcrypt';
import {db} from '../config/firebase.js';

// Firestore collection reference (inside 'test' collection)
const collectionRef = db.collection('test').doc('employees').collection('data');

// ✅ Create a new employee
export const createEmployee = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { employeeId, name, jobTitle, description, salary, phoneNumber, email, address, status, password } = req.body;

    if (!employeeId || !name || !jobTitle || !description || !salary || !phoneNumber || !email || !status || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newEmployee = {
      employeeId,
      name,
      jobTitle,
      description,
      salary,
      phoneNumber,
      email,
      address,
      status,
      password: hashedPassword,
      isAdmin: false, // Default value
    };

    await collectionRef.doc(employeeId).set(newEmployee);
    console.log("Employee saved to Firestore");

    await sendWelcomeEmail(email, employeeId, password);
    console.log("Welcome email sent successfully");

    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};

// ✅ Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const snapshot = await collectionRef.get();
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ employees });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving employees', error });
  }
};

// ✅ Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const doc = await collectionRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ employee: doc.data() });
  } catch (error) {
    res.status(400).json({ message: 'Error retrieving employee', error });
  }
};

// ✅ Update an employee
export const updateEmployee = async (req, res) => {
  try {
    const doc = await collectionRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await collectionRef.doc(req.params.id).update(req.body);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee', error });
  }
};

// ✅ Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const doc = await collectionRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await collectionRef.doc(req.params.id).delete();
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting employee', error });
  }
};

// ✅ Search employees by name (case-insensitive)
export const searchEmployees = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }

    const snapshot = await collectionRef.where('name', '>=', name).where('name', '<=', name + '\uf8ff').get();
    const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Check if an employee is admin
export const isAdminOrnot = async (req, res) => {
  try {
    const doc = await collectionRef.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      name: doc.data().name,
      isAdmin: doc.data().isAdmin,
    });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
