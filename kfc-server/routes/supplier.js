const {PrismaClient, Prisma} = require("@prisma/client");
const { verify } = require("argon2");

const express = require("express");

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router()

const prisma = new PrismaClient();

// Get all suppliers
router.get('/', async (req, res)=>{
    try {
        const suppliers = await prisma.supplier.findMany()
        return res.json({success: true, suppliers})
    }
    catch (e) {
        return res.status(401).json({success: "false", message: e.message()})
    }
})

// Get a specific supplier infomation
router.get('/:id', async (req, res) =>{
    const {id} = req.params
    try {
        const supplier = await prisma.supplier.findFirst({where: {id}})
        // Default case
        return res.json({success: true, supplier})
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


// Create new supplier
router.post('/',verifyToken, upload.none(), async (req, res) =>{
    const {name, email, phone, description} = req.body
    try {
        let newSupplier = {
            name, email, phone, description
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
                return res.status(404).json({success: false, message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
        }
        return res.status(401).json({success: false, message: e.message})

    }
} )

//Update supplier infomation
router.put('/:id', verifyToken, upload.none(), async (req, res) => {
    const {name, phone, description, email} = req.body
    const {id} = req.params
    try{
        const queryRes = await prisma.supplier.update({
            where: {
                id: id
            },
            data: {
                name: name ? name : undefined,
                phone: phone ? phone : undefined,
                email: email ? email : undefined,
                description: description ? description : undefined
            }
        })

        return res.json({success: true, supplier: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
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

        return res.json({success: true, supplier: queryRes})
    }
    catch(e) {
        return res.status(404).json({success: false, message: e.message})
    }
})

module.exports = router