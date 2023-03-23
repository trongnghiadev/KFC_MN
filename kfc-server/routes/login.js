const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const {email, password, app} = req.body;
    try{
        const user = await prisma.user.findFirstOrThrow({where: {email: email}})
        if (user.password !== password) throw new Error("Wrong password or username")
        if (user.role !== "admin" && app == "admin") throw new Error("You don't have permission to access this page")
        return res.status(200).json({success: true, uid: user.id})
    }
    catch(e){
        return res.status(500).json({success:false, message: e.message})
    }
})

module.exports = router