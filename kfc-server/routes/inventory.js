const {PrismaClient, Prisma, Ingredient_Unit} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/multer");
const capitalize = require("../utils/capitalize")

// Get all logs
router.get('/', verifyToken, async (req, res)=>{
    const {warehouse} = req.query
    try {
        let inventoryLogs = await prisma.inventory_Adjustment.findMany({where: {warehouseId: warehouse}, include:{warehouse: true}})
        if (req.user.role !== "admin" && req.user.id !== inventoryLogs[0].warehouse.ownerId) throw new Error("No permission!")

        inventoryLogs = inventoryLogs.map((inv) => ({...inv, state: capitalize(inv.state), type: capitalize(inv.type)}))

        return res.json({success: true, inventoryLogs})
    }
    catch (e) {
        return res.status(401).json({success: "false", message: e.message})
    }
})

router.get('/:id', verifyToken, async (req, res)=>{
    const {warehouse} = req.query
    const {id} = req.params
    try {
        const inventoryLog = await prisma.inventory_Adjustment.findUnique({where: {id}, include:{warehouse: true}})
        if (req.user.role !== "admin" && req.user.id !== inventoryLog.warehouse.ownerId) throw new Error("No permission!")
        return res.json({success: true, inventoryLog})
    }
    catch (e) {
        return res.status(401).json({success: "false", message: e.message})
    }
})

// Add new inventory adjustments
router.post("/", verifyToken, upload.none(), async (req, res)=>{
    const {from, to, type, note, detail, warehouseId} = req.body
    try{
        let newLog = {from, to, type, note, warehouse: {connect: {id: warehouseId}}}
        newLog = await prisma.inventory_Adjustment.create({
            data: newLog
        })

        return res.json({success: true, inventoryLog: newLog})
    } catch (e){
        return res.status(400).json({success: false, message: e.message})
    }
})

router.delete("/:id", verifyToken, async (req, res) => {
    const {id} = req.params
    try{
        if (req.user.role != "admin" && req.user.role != "wh") throw new Error("No permission!")
        const log = await prisma.inventory_Adjustment.update({
            where: {id},
            data: {state: "cancel"}
        })

        return res.json({success: true, inventoryLog: log})
    } catch (e) {
        return res.status(400).json({success: false, message: e.message})
    }
})


module.exports = router
