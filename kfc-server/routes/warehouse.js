const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const verifyToken = require('../middleware/auth')
const upload = require('../middleware/multer')

const prisma = new PrismaClient();

// Get specific warehouse information
router.get('/:id', verifyToken, async (req, res) => {
    let {uid} = req.body
    let id = req.params.id
    try{
        const permission = await prisma.user.findFirst({where: {id: uid}, select: {role: true}})
    
        let criteria = permission == 'admin' || permission.id === uid ? {id} : {}
        let warehouse = await prisma.warehouse.findFirst({where: criteria, select: {id: true, name: true, state: true, address: true, owner: true, facilities:true, ingredients: true}})
        
        return res.json({success: true, warehouse})
    } catch(e){
        return res.json({success: false, message: e.message})
    }
})

// Get specific warehouse facilities information
router.get('/:id/facilities', verifyToken, async (req, res) => {
    let {uid} = req.body
    let id = req.params.id
    try{
        const permission = await prisma.user.findFirst({where: {id: uid}, select: {role: true}})
    
        let criteria = permission == 'admin' || permission.id === uid ? {id} : {}
        let warehouse = await prisma.warehouse.findFirst({where: criteria, select: {facilities:true}})
        
        return res.json({success: true, facilities})
    } catch(e){
        return res.json({success: false, message: e.message})
    }
})

// Get all the warehouse infomation
router.get('/', verifyToken, async (req, res) => {
    let {uid} = req.body

    try{
        const permission = await prisma.user.findFirst({where: {id: uid}, select: {role: true}})
    
        let criteria = permission == 'admin' ? {ownerId: uid} : {}
        let warehouse = await prisma.warehouse.findMany({where: criteria, select: {id: true, name: true, state: true, address: true, owner: true}})
        
        return res.json({success: true, warehouse})
    } catch(e){
        return res.json({success: false, message: e.message})
    }
})


// Create a new warehouse
router.post('/', verifyToken, upload.none(), async (req, res) => {
    let {uid, name, address, ownerId, state} = req.body
    if (!ownerId) ownerId = uid
    state = undefined ? 'inactive' : state;
    try{
        let setOwner = {owner: {connect: {id: ownerId}}}
        let warehouse = {name, address, state, ...setOwner}
        warehouse = await prisma.warehouse.create({data: warehouse, include: {owner: true}});

        return res.json({success: true, warehouse})
    } catch (e) {
        return res.json({success: false, message: e.message})
    }
})


// Update warehouse
router.put('/:id', verifyToken, upload.none(), async (req, res) => {
    let {id} = req.params
    let {name, address, state} = req.body
    state = undefined ? 'inactive' : state;
    try{
        let warehouse = {name, address, state}
        warehouse = await prisma.warehouse.update({where: {id}, data: warehouse});

        return res.json({success: true, warehouse})
    } catch (e) {
        return res.json({success: false, message: e.message})
    }
})

router.delete('/:id', verifyToken, async(req, res)=>{
    const {id} = req.params
    try{
        const warehouse = await prisma.warehouse.findUnique({where: {id}})

        if (req.user.role != "admin" && req.userId != warehouse.ownerId) throw new Error("No permission!")

        const delWarehouse = await prisma.warehouse.delete({where: {id}})

        return res.json({success:true, warehouse: delWarehouse})

    } catch(e) {
        return res.status(405).json({success:false, message: e.message})
    }
})


module.exports = router;