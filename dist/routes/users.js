const express = require('express');
const ExpressError = require('../expressError');
const User = require('../models/user');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const userRoutes = express.Router();
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
userRoutes.get('/', ensureLoggedIn, async (req, resp, next) => {
    try {
        const users = await User.all();
        return resp.json({ users });
    }
    catch (err) {
        return next(err);
    }
});
/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
userRoutes.get('/:username', ensureCorrectUser, async (req, resp, next) => {
    try {
        const { username } = req.params;
        const user = await User.get(username);
        return resp.json({ user });
    }
    catch (err) {
        return next(err);
    }
});
/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
userRoutes.get('/:username/to', ensureCorrectUser, async (req, resp, next) => {
    try {
        const { username } = req.params;
        const messages = await User.messagesTo(username);
        return resp.json({ messages });
    }
    catch (err) {
        return next(err);
    }
});
/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
userRoutes.get('/:username/from', ensureCorrectUser, async (req, resp, next) => {
    try {
        const { username } = req.params;
        const messages = await User.messagesFrom(username);
        return resp.json({ messages });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = userRoutes;
