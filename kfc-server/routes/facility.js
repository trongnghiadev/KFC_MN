const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const router = express.Router()

const prisma = new PrismaClient();

// Get all facilities
router.get('/', async (req, res)=>{
    try {
        const facilities = await prisma.facility.findMany({include: {supplier: true}})
        return res.json({success: true, method: "get", facilities})
    }
    catch (e) {
        return res.status(401).json({success: "false", method: "get", message: e.message()})
    }
})

// Get a specific facilities infomation
router.get('/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const facility = await prisma.facility.findFirst({where: {id}, include: {supplier: true}})
        return res.json({success: true, method: "get", facility})
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

// Create new facility
router.post('/', async (req, res) =>{
    const {name, unit, in_value, amount, supplierId} = req.body
    try {
        let newfacility = {
            name, unit, in_value, amount, supplierId
        }
        const queryRes = await prisma.facility.create({
            data: newfacility
        })

        return res.json({success: true, facility: queryRes})
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
        const queryRes = await prisma.facility.update({
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

        return res.json({success: true, method: "put", facility: queryRes})
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
        const delfacility = prisma.facility.delete({
            where: {
                id: id
            }
        })

        const delFoodfacility = prisma.foodfacility.deleteMany({
            where: {
                facilityId: id
            }
        })

        await prisma.$transaction([delFoodfacility, delfacility])

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