const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

// Get all suppliers
router.get('/', async (req, res)=>{
    try {
        const suppliers = await prisma.supplier.findMany()
        return res.json({success: true, method: "get", suppliers})
    }
    catch (e) {
        return res.status(401).json({success: "false", method: "get", message: e.message()})
    }
})

// Get a specific supplier infomation
router.get('/:id', async (req, res) =>{
    const options = req.body.options
    const id = req.params.id
    try {
        const supplier = await prisma.supplier.findFirst({where: {id}})

        // Get all ingredient of a supplier
        const supplierAndIngredients = await prisma.ingredient.findMany({where: {supplierId: id}})
        if (options && options.getAllIngredients) return res.json({success: true, method: "get", supplier: {...supplier, ingredients: supplierAndIngredients}})

        // Default case
        return res.json({success: true, method: "get", supplier})
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
    const {name, email, phone} = req.body
    try {
        let newSupplier = {
            name, email, phone
        }
        const supplier = await prisma.supplier.create({
            data: newSupplier
        })

        return res.json({success: true, method: "post", supplier})
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
    const {name, phone} = req.body
    const {id} = req.params
    try{
        const queryRes = await prisma.supplier.update({
            where: {
                id: id
            },
            data: {
                name: name ? name : undefined,
                phone: phone ? phone : undefined
            }
        })

        return res.json({success: true, method: "put", supplier: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, method: "put", message: e.message})
    }
})

//Wanted req : url has a id param (target)
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try{
        const targetSupplier = await prisma.supplier.findFirst({
            where: {id}
        }).catch(()=> {throw new Error('Supplier not found')})

        if (targetSupplier?.Ingredient && targetSupplier.Ingredient?.size() !== 0) throw new Error("Current supplier are running")

        const queryRes = await prisma.supplier.delete({
            where: {
                id: id
            }
        })

        return res.json({success: true, method: "delete", supplier: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, method: "delete", message: e.message})
    }
})

module.exports = router