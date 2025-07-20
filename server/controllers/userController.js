//userController.js
const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const fs = require('fs');




const registerUser = async (req, res) => {
    const { first_name, last_name, email, phone_number, password, role } = req.body;

    // Validate 
    if (!first_name || !last_name || !email || !phone_number || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the email is already registered
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        const userRole = role || 'user';

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user with role
        await db.query(
            'INSERT INTO users (first_name, last_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone_number, hashedPassword, userRole]
        );

        // Return success 
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users ' });
    }
};


const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};



module.exports = { registerUser, getAllUsers, getUserById };