const express = require('express')
const ExpressError = require('../expressError')
const Message = require('../models/message')
const User = require('../models/user')
const {SECRET_KEY} = require('../config')
const { ensureCorrectUser, ensureLoggedIn } = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const messageRoutes = express.Router()

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

messageRoutes.get('/:id', ensureLoggedIn, async (req, resp, next) => {
    try {
        const {id} = req.params
        const message = await Message.get(id)
        const {username} = jwt.decode(req.body._token)
        const toUser = message.to_user.username
        const fromUser = message.from_user.username
        
        if (username !== toUser && username !== fromUser) {
            return new ExpressError('Unauthorized', 400)
        }        

        return resp.json({message})
    } catch (err) {
        return next(err)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

messageRoutes.post('/', ensureLoggedIn, async (req, resp, next) => {
    try {
        const { to_username, body } = req.body
        const from_username = jwt.verify(req.body._token, SECRET_KEY).username
        
        const result = await Message.create({from_username, to_username, body})
            
        return resp.status(201).json({message: {
            id: result.id,
            from_username: result.from_username,
            to_username: result.to_username,
            body: result.body,
            sent_at: result.sent_at
        }})    
    } catch (err) {
        return next(err)
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

messageRoutes.post('/:id/read', ensureLoggedIn, async (req, resp, next) => {
    try {
        const {id} = req.params
        const username = jwt.verify(req.body._token, SECRET_KEY).username
        const msg = await Message.get(id)
        const to_username = msg.to_user.username

        if (username !== to_username) {
            throw new ExpressError("Unauthorized", 400)
        }
        
        const result = await Message.markRead(id)
        console.log(result)

        return resp.status(201).json(result)

    } catch (err) {
        return next(err)
    }
})

module.exports = messageRoutes