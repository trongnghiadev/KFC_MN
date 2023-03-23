const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

// Get all ingredients
router.get('/', async (req, res)=>{
    try {
        const ingredients = await prisma.ingredient.findMany({include: {supplier: true}})
        return res.json({success: true, method: "get", ingredients})
    }
    catch (e) {
        return res.status(401).json({success: "false", method: "get", message: e.message()})
    }
})

// Get a specific ingredient infomation
router.get('/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const ingredient = await prisma.ingredient.findFirst({where: {id}, include: {supplier: true}})
        return res.json({success: true, method: "get", ingredient})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, method: "post", message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})

    }
} )

// Create new supplier
router.post('/', async (req, res) =>{
    const {name, unit, price, supplierId} = req.body
    try {
        let newIngredient = {
            name, unit, price, supplierId
        }
        const queryRes = await prisma.ingredient.create({
            data: newIngredient
        })

        return res.json({success: true, method: "post", ingredient: queryRes})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, method: "post", message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})

    }
} )

//Update supplier infomation
router.put('/:id', async (req, res) => {
    const {name, unit, price, supplierId} = req.body
    const {id} = req.params
    try{
        const queryRes = await prisma.ingredient.update({
            where: {
                id: id
            },
            data: {
                name: name ? name : undefined,
                unit: unit ? unit : undefined,
                price: price ? price : undefined,
                supplierId: supplierId ? supplierId : undefined
            }
        })

        return res.json({success: true, method: "put", ingredient: queryRes})
    }
    catch(e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, method: "put", message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, method: "put", message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})

    }
})

//Wanted req : url has a id param (target)
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try{
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
                return res.status(404).json({success: false, method: "put", message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, method: "put", message: `${e.meta.target} not found`})
            }
            if (e.code === 'P2025') {
                return res.status(404).json({success: false, method: "put", message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})

    }
})

module.exports = router