const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { emailid, password } = req.body;
        const passHash = bcrypt.hashSync(password, 10);
        const newUser = new User({ emailid: emailid, password: passHash });
        const token = jwt.sign({ emailid: emailid }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        await newUser.save();
        res.status(201).json({ token, message: 'User registered successfully' });
    } catch(err) {
        if (err.code === 11000) { // Duplicate key error code
            // Handle duplicate key error
            return res.status(400).json({ error: 'Email address already exists' });
        }
        res.status(500).json({ error: 'Signup failed' });
    }
};

exports.logout = async (req, res) => {
    try {
        const {
            secure,
        } = req.session.cookie;
        res.clearCookie('sessionID', { httpOnly: false, secure: secure });
        req.session.destroy();
        return res.status(200).json({ message: 'User has been logged out' });            
    } catch (err) {
        res.status(500).json({ err, message: 'unable to logout' });
    }
}

exports.signin = async (req, res) => {
    const sessionID = req.sessionID;
    try {
        const { emailid, password } = req.body;
        const ifUserExist = await User.findOne({ emailid });
        if (!ifUserExist) {
            return res.send({ status: 404, message: 'User does not, Please signup' });
        }
        const passwordMatch = await bcrypt.compare(password, ifUserExist.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ emailid: ifUserExist.emailid }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const userData = {token, email: emailid};
        req.session.user = userData;
        req.session.authenticated = true;
        req.session.save(err => {
            if(err){
                console.log('error in saving user', err)
            } else {
                const {
                    originalMaxAge,
                    secure,
                } = req.session.cookie;
                res.cookie('sessionID', sessionID, { maxAge: originalMaxAge, secure: secure, httpOnly: false })
                res.status(200).json({sessionID, token});
            }
        });
    } catch(e) {
        res.status(500).json({ error: 'Signin failed' });
    }
};
