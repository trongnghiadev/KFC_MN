const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express");
const verifyToken = require("../middleware/auth");

const router = express.Router()

const prisma = new PrismaClient();

// get current login info
router.get('/current', verifyToken, async (req, res) => {
    try{
        const user = await prisma.user.findUnique({
            where: {id: req.userId}, 
            select: {id:true, name: true, email: true, role: true, state: true}
        })

        if (user === null) return res.status(404).json({success: false, message: `User does not exist`})

        return res.json({success: true, user: user})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

// Get a specific user
router.get('/:id', async (req, res) => {
    const {id} = req.params
    try{
        const user = await prisma.user.findFirst({
            where: {id: id}, 
            select: {id:true, name: true, email: true, role: true, state: true}
        })

        if (user === null) return res.status(404).json({success: false, message: `User does not exist`})

        return res.json({success: true, user: user})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

// Get all users
router.get('/', verifyToken ,async (req, res)=>{
    try{
        if (req.user.role != "admin") throw new Error ("No permission!")
        // Find user    
        const user = await prisma.user.findMany({select: {id:true, name: true, email: true, role: true, state: true}})

        return res.json({success: true, users: user})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})



//Create a user
router.post('/', async (req, res) => {
    const {name, email, password, role, state} = req.body
    try{
        // Create a new user
        let newUser = {
            name, email, password, role, state
        }
        // Query this
        const queryRes = await prisma.user.create({data: newUser})
        
        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
        }
        return res.status(404).json({success: false, message: e.message})
    }
})

//Update user infomation
router.put('/:id', async (req, res) => {
    const {name, email, role, state, currentId} = req.body
    const {id} = req.params
    // const currentId = req.header["userId"]
    try{

        //Normal account can update their name, password. Only admin account can update user's role
        const currentUser = await prisma.user.findFirst({where: {id: currentId}})
        if (role && currentUser.role !== "admin") throw new Error("Not admin user")
        const queryRes = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name: name ? name : undefined,
                email: email ? email: undefined,
                state: state? state : undefined
            }
        })

        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

//Delete user
//Wanted req : { header: {uid: ""}} , url has a id param (target)
router.delete('/:id', async (req, res) => {
    const {uid} = req.body
    const {id} = req.params
    try{
        const currentUser = await prisma.user.findFirst({
            where: {id: uid}
        })
        
        if (currentUser && currentUser.role !==  "admin") throw new Error("Current user is not admin")

        const queryRes = await prisma.user.delete({
            where: {
                id: id
            }
        })
        return res.json({success: true, user: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})


module.exports = router