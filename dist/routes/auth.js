const express = require('express');
const jwt = require('jsonwebtoken');
const ExpressError = require('../expressError');
const User = require('../models/user');
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require('../config');
const authRoutes = express.Router();
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
authRoutes.post('/login', async (req, resp, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ExpressError("Username and password required", 400);
        }
        const isValid = await User.authenticate(username, password);
        if (isValid) {
            const token = jwt.sign({ username }, SECRET_KEY);
            await User.updateLoginTimestamp(username);
            return resp.json({ token });
        }
        throw new ExpressError("Invalid username/password", 400);
    }
    catch (err) {
        return next(err);
    }
});
/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
authRoutes.post('/register', async (req, resp, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        if (!username || !password || !first_name || !last_name || !phone) {
            throw new ExpressError("Username, password, first name, last name, and phone number required for registration", 400);
        }
        const user = await User.register(req.body);
        const token = jwt.sign({ user }, SECRET_KEY);
        await User.updateLoginTimestamp(username);
        return resp.json({ token });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = authRoutes;
