const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express");
const checkPermission = require("../utils/checkPermission");

const router = express.Router()

const prisma = new PrismaClient();

const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth')

router.post('/login', async (req, res) => {
    const {email, password, app} = req.body;

    // Simply validattion
    if (!email || !password)
        return res.status(400).json({ success: false, message: 'Missing email and/or password' })

    try {
        // Is username valid?
        const user = await prisma.user.findFirst({where: {email}})

        if (!user)
            return res.status(400).json({ success: false, message: 'Email and/or password incorrect' })

        // No permission
        if (user.role != "admin" && user.role != "wh" && app == "admin") return res.status(401).json({ success: false, message: 'No permission!' })

        // Username found
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) return res.status(400).json({ success: false, message: 'Username and/or password incorrect' })

        // All okay

        const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"});
  
        return res.json({ success: true, message: 'Login success!', accessToken, uid: user.id })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Interval server error' })
    }
})

router.post('/register', async (req, res) => {
    const { email, password, name, state, role} = req.body;
    //Simple validation
    if (!email || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password' })
    try {
        //Check if extinct username
        const user = await prisma.user.findFirst({where: {email}})

        if (user) return res.status(400).json({ success: false, message: 'Username already took!' })
        
        //Check roles
        // const reqUser = await prisma.user.findFirst({where: {id: req.userId}})
        // if (reqUser.roles !== "admin") return res.status(401).json({ success: false, message: 'No permissions⚠️' })
        
        //All okay

        const hashedPassword = await argon2.hash(password);

        const newUser = await prisma.user.create({data: {
            email: email || undefined,
            password: hashedPassword,
            name: name,
            state: state || "unavailable",
            role: role || "other"
        }})

        // Return token
        const accessToken = jwt.sign({ userId: newUser.id }, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({ success: true, message: 'User added successfully!', accessToken });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: 'Interval server error' })
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await prisma.user.findFirst({where: {id: req.userId}})
        if (!user) return res.status(400).json({ success: false, message: 'User not found!' })

        return res.json({ success: true, user })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: 'Interval server error' })

    }
})
module.exports = router