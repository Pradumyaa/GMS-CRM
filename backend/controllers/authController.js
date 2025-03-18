import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';
import {db} from '../config/firebase.js';
// Login with employeeId
export const login = async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        
        if (!employeeId || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
  
        // Update the path to match your structure
        const employeeDoc = await db.doc(`/test/employees/data/${employeeId}`).get();
  
        if (!employeeDoc.exists) {
            return res.status(404).json({ message: 'Employee not found' });
        }
  
        const employee = employeeDoc.data();
  
        // Verify password exists
        if (!employee.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        // Compare password
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        // Generate token
        const token = generateToken({
            id: employeeDoc.id,
            employeeId: employee.employeeId
        });
  
        // Remove sensitive data
        const { password: _, ...employeeData } = employee;
  
        res.status(200).json({
            message: 'Login successful',
            token,
            employee: employeeData
        });
  
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
  };