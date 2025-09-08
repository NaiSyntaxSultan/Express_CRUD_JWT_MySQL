const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req,res) => {
    try {
        // code

        // 1.CheckUser
        const { username, email, password } = req.body;

        var user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }
        // 2.Encrypt
        const salt = await bcrypt.genSalt(10);
        user = new db.User({
            username,
            email,
            password: await bcrypt.hash(password, salt)
        });

        // 3.Save
        await user.save();
        // 4.Response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });


    } catch (err) {
        // code
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.login = async (req,res) => {
    try {
        // code
        // 1.Check User
        const { email, password } = req.body;
        var user = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            // 2.Payload
            var payload = {
                user: {
                    name: user.username,
                    email: user.email
                }
            }

            // 3.Generate Token
            jwt.sign(payload, 'jwtsecret', { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token: token,
                    payload: payload
                });
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            });
        }

    } catch (err) {
        // code
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

