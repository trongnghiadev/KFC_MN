const {PrismaClient, Prisma, Ingredient_Unit} = require("@prisma/client")

const express = require("express")

const fs = require("fs");
const upload = require("../middleware/multer")
const cloudinary = require("../plugin/cloudinary");
const streamifier = require("streamifier");
const verifyToken = require("../middleware/auth");

const router = express.Router()

const prisma = new PrismaClient();

// Get facilities units
router.get('/units', async (req, res) =>{
    const units = Object.keys(Ingredient_Unit)
    try {
        return res.json({success: true, units})
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

// Get all facilities
router.get('/', async (req, res)=>{
    let {warehouse} = req.query
    try {
        const facilities = await prisma.facility.findMany({include: {supplier: true}, where: {warehouseId: warehouse}})
        return res.json({success: true, facilities})
    }
    catch (e) {
        return res.status(401).json({success: "false", message: e.message})
    }
})

// Get a specific facilities infomation
router.get('/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const facility = await prisma.facility.findFirst({where: {id}, include: {supplier: true}})
        return res.json({success: true, facility})
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
router.post('/',verifyToken, upload.single("image"),  async (req, res) =>{
    let {name, cost, amount, issue_amount, state, unit, warehouseId} = req.body
    // TODO: Config the supplier

    //Images handler
    const imageFile = req.file
    try {
        cost = !isNaN(parseFloat(cost)) ? parseFloat(cost) : 0
        issue_amount = !isNaN(parseFloat(issue_amount)) ? parseFloat(issue_amount) : 0
        amount = !isNaN(parseFloat(amount)) ? parseFloat(amount) : 0
        let newFacility = {
            name, cost, amount, issue_amount, state, unit, warehouseId
        }

        let queryRes = await prisma.facility.create({
            data: {...newFacility}, include: {supplier: true}})
        // Image upload
        if (imageFile)
        {
            const {path} = imageFile;
            const fileBuffer = fs.readFileSync(path)
            const fileStream = streamifier.createReadStream(fileBuffer);
            const image = await cloudinary.upload(fileStream, "facility", queryRes.id);
            queryRes = await prisma.facility.update({where: {id: queryRes.id}, data: {image: image}})
            fs.unlinkSync(path);
        }

        
        return res.json({success: true, facility: queryRes})
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

// Update facility information
router.put('/:id',upload.single("image") , async (req, res) => {
    let {name, cost, amount, issue_amount, state, supplierId, unit} = req.body
    const {id} = req.params
    const imageFile = req.file
    try{
        cost = !isNaN(cost) ? parseFloat(cost) : 0
        issue_amount = !isNaN(issue_amount) ? parseFloat(issue_amount) : 0
        amount = !isNaN(amount) ? parseFloat(amount) : 0
        let queryRes = await prisma.facility.update({
            where: {
                id
            },
            data: {
                name : name ? name : undefined,
                cost : cost ? cost : undefined,
                amount : amount ? amount : undefined,
                issue_amount : issue_amount ? issue_amount : undefined,
                state : state ? state : undefined,
                unit : unit ? unit : undefined
            }
        })

        if (imageFile)
        {
            const {path} = imageFile;
            const fileBuffer = fs.readFileSync(path)
            const fileStream = streamifier.createReadStream(fileBuffer);
            const image = await cloudinary.upload(fileStream, "facility", queryRes.id);
            fs.unlinkSync(path);
            queryRes = await prisma.facility.update({where: {id: queryRes.id}, data: {image: image}})
        }

        return res.json({success: true, facilities: queryRes})
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
        return res.status(401).json({success: false, message: e.message})

    }
})


//Delete facility
router.delete('/:id',verifyToken, async (req, res) => {
    const {id} = req.params
    try{
        const delFacility = prisma.facility.delete({
            where: {
                id
            }
        })
        await prisma.$transaction([delFacility])

        return res.json({success: true})
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