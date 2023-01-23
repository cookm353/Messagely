/** User class for message.ly */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const db = require('../db')
const ExpressError = require('../expressError')
const { BCRYPT_WORK_FACTOR } = require('../config')

/** User of the site. */

interface UserRegistration {
    username: String
    password: String
    first_name: String
    last_name: String
    phone: String
}

interface User {
    username: String
    first_name: String
    last_name: String
    phone: String
}
interface messageFrom {
    id: Number
    to_user: User
    sent_at: String
    read_at: String
}

interface messageTo {
    id: Number
    from_user: User
    body: String
    sent_at: String
    read_at: String
}

class User {

    /** register new user -- returns
     *    {username, password, first_name, last_name, phone}
     */
  
    static async register({username, password, first_name, last_name, phone}: UserRegistration) {
        const hashedPass = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        
        const results = await db.query(
            `INSERT INTO users (
                username,
                password,
                first_name,
                last_name,
                phone,
                join_at,
                last_login_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING username, 
                password, 
                first_name,
                last_name,
                phone`,
            [username, hashedPass, first_name, last_name, phone]
        )

        return results.rows[0]
     }
  
    /** Authenticate: is this username/password valid? Returns boolean. */
  
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT password
            FROM users
            WHERE username = $1`,
            [username]
        )
        const hashedPassword = result.rows[0].password
        const isValid = await bcrypt.compare(password, hashedPassword)

        return isValid
    }
  
    /** Update last_login_at for user */
  
    static async updateLoginTimestamp(username) {
        await db.query(
            `UPDATE users
            SET last_login_at = CURRENT_TIMESTAMP
            WHERE username = $1`,
            [username]
        )
    }
  
    /** All: basic info on all users:
     * [{username, first_name, last_name, phone}, ...] */
  
    static async all() {        
        const results = await db.query(
            `SELECT username,
                first_name,
                last_name,
                phone
            FROM users;`
        )

        return results.rows
    }
  
    /** Get: get user by username
     *
     * returns {username,
     *          first_name,
     *          last_name,
     *          phone,
     *          join_at,
     *          last_login_at } */
  
    static async get(username) {
        await User.checkForUser(username)
        
        const results = await db.query(
            `SELECT username,
                first_name,
                last_name,
                phone,
                join_at,
                last_login_at
            FROM users
            WHERE username = $1`,
            [username]
        )

        return results.rows[0]
     }
  
    /** Return messages from this user.
     *
     * [{id, to_user, body, sent_at, read_at}]
     *
     * where to_user is
     *   {username, first_name, last_name, phone}
     */ 

    static async messagesFrom(username) {
        await User.checkForUser(username)
        
        const results = await db.query(
            `SELECT id, 
                to_username,
                first_name,
                last_name,
                phone,
                body,
                sent_at,
                read_at
            FROM messages JOIN users
                ON to_username = username
            WHERE from_username = $1`,
            [username]
        )

        const msgs = results.rows.map(row => ({
            id: row.id,
            to_user: {
                username: row.to_username,
                first_name: row.first_name,
                last_name: row.last_name,
                phone: row.phone
            },
            body: row.body,
            sent_at: row.sent_at,
            read_at: row.read_at
        }))

        return msgs
    }
  
    /** Return messages to this user.
     *
     * [{id, from_user, body, sent_at, read_at}]
     *
     * where from_user is
     *   {username, first_name, last_name, phone}
     */

    static async messagesTo(username) {
        await User.checkForUser(username)

        const results = await db.query(
            `SELECT id,
                from_username,
                first_name,
                last_name,
                phone,
                body,
                sent_at,
                read_at
            FROM messages JOIN users
                ON from_username = username
            WHERE to_username = $1`,
            [username]
        )

        const msgs = results.rows.map(row => ({
            id: row.id,
            from_user: {
                username: row.from_username,
                first_name: row.first_name,
                last_name: row.last_name,
                phone: row.phone
            },
            body: row.body,
            sent_at: row.sent_at,
            read_at: row.read_at
        }))

        return msgs
    }

    static async isUsernameFree(username): Promise<boolean> {
        const user = User.get(username)
        if (user) {
            return false
        }
        return true
    }

    static async checkForUser(username) {
        const result = await db.query(
            `SELECT *
            FROM users
            WHERE username = $1`,
            [username]
        )

        if (!result.rows[0]) {
            throw new ExpressError("User not found", 400)
        }
    }
  }



async function register() {
    // await db.query(`DELETE FROM messages`)
    // await db.query(`DELETE FROM users`)

    const aliceDetails: UserRegistration = {
        username: 'bob',
        password: 'test123',
        first_name: 'Bob',
        last_name: 'Tester',
        phone: '+914-686-0096'
    }

    const alice = await User.register(aliceDetails)
    return alice
}

async function main() {
    // const alice = await register()
    const msgs = await User.messagesTo('alicce')
    console.log(msgs)
    // await User.userExists('alice')
    

    // const pass = await db.query(`SELECT password FROM users WHERE username ='alice'`)
    // console.log(typeof pass.rows[0])
}

main()

module.exports = User;