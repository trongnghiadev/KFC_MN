const {PrismaClient, Prisma, Ingredient_Unit} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/multer");

// Get all ingredients
router.get('/', async (req, res)=>{
    const {warehouse} = req.query
    try {
        const ingredients = await prisma.ingredient.findMany({where: {warehouseId: warehouse}, include: {supplier: true}})
        return res.json({success: true, ingredients})
    }
    catch (e) {
        return res.status(401).json({success: "false", message: e.message})
    }
})


// Get all ingredients
router.get('/constants', async (req, res)=>{
    try {
        let units = [];
        for (const unit of Object.keys(Ingredient_Unit)){
            units.push(unit)
        }
        let suppliers = await prisma.supplier.findMany();
        suppliers = suppliers.map((sup)=>({label: sup.name, id: sup.id}))
        return res.json({success: true, constants: {units, suppliers}})
    }
    catch (e) {
        return res.status(401).json({success: "false", message: e.message})
    }
})

// Get a specific ingredient infomation
router.get('/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const ingredient = await prisma.ingredient.findFirst({where: {id}, include: {supplier: true}})
        return res.json({success: true, ingredient})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, message: e.message})

    }
} )

// Create new ingredients
router.post('/', verifyToken, upload.none(), async (req, res) =>{
    let {name, unit, cost, stock, supplierId, warehouseId, state} = req.body
    try {
        if (req.user.role != "admin" && req.user.role != "wh" ) 
            return res.status(401).json({success: false, message: "No permission"})
        if (stock <= 0) state = "ofs"
        let newIngredient = {
            name, unit, cost, stock, 
            supplier : {
                connect: {id: supplierId}
            }, 
            warehouse : {
                connect: {id: warehouseId}
            },
            state
        }

        const queryRes = await prisma.ingredient.create({
            data: newIngredient, include: {supplier: true, warehouse: true}
        })

        return res.json({success: true, ingredient: queryRes})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
        }
        return res.status(400).json({success: false, message: e.message})

    }
} )

//Update ingredients infomation
router.put('/:id', verifyToken, upload.none(),async (req, res) => {
    let {name, unit, cost, stock, supplierId, state} = req.body
    const {id} = req.params
    console.log(supplierId);
    try{
        if (req.user.role != "admin" && req.user.role != "wh" ) 
            return res.status(401).json({success: false, message: "No permission"})
        if (stock <= 0) state = "ofs"
        const updateData = {
            name, unit, cost, stock, state
        }
        if (supplierId != "undefined") updateData.supplier = {connect: {id: supplierId}}
        else updateData.supplier = {disconnect: true}
        const queryRes = await prisma.ingredient.update({
            where: {
                id: id
            },
            data: updateData
        })

        return res.json({success: true, ingredient: queryRes})
    }
    catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, message: `${e.meta.target} not found`})
            }
        }
        return res.status(400).json({success: false, message: e.message})

    }
})

//Wanted req : url has a id param (target)
router.delete('/:id', verifyToken,async (req, res) => {
    const {id} = req.params
    try{
        if (req.user.role != "admin" && req.user.role != "wh")
            return res.status(401).json({success: false, message: "No permission!"})

        const delIngredient = prisma.ingredient.delete({
            where: {
                id: id
            }
        })

        const delFoodIngredient = prisma.foodIngredient.deleteMany({
            where: {
                ingredientId: id
            }
        })

        await prisma.$transaction([delFoodIngredient, delIngredient])

        return res.json({success: true, method: "delete"})
    }
    catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, message: `${e.meta.target} not found`})
            }
            if (e.code === 'P2025') {
                return res.status(404).json({success: false, message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, message: e.message})

    }
})

module.exports = router