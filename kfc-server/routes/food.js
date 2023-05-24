const {PrismaClient, Prisma, Food_Cat} = require("@prisma/client");

const express = require("express");
const fs = require("fs");
const upload = require("../middleware/multer")
const cloudinary = require("../plugin/cloudinary");
const streamifier = require("streamifier");
const checkPermission = require("../utils/checkPermission");
const verifyToken = require("../middleware/auth");
const multer = require("multer");

const router = express.Router()

const prisma = new PrismaClient();

// Get all foods
router.get('/', async (req, res)=>{
    try {
        const foods = await prisma.foodItem.findMany()
        return res.json({success: true, method: "get", foods})
    }
    catch (e) {
        return res.status(401).json({success: "false", method: "get", message: e.message})
    }
})

// Get category types
router.get('/categories', async(req, res) => {
    try {
        let categories = [];
        for (const cat of Object.keys(Food_Cat)){
            categories.push(cat)
        }

        let categoriesWithLabel = {
            list: [
                    "new",
                    "combo4one",
                    "combo4group",
                    "chicken",
                    "carb",
                    "snack",
                    "dessert_drink",
                    "other",
            ],
            labels: ['New', "Combo", "Group Combo", "Fry chicken", "Carb", "Snack", "Dessert & Drink", "Others"]
        }

        // So lazy to handle this stupid step :< so sorry for whom watch this
        categoriesWithLabel = categoriesWithLabel.list.map((item, i)=>{
            return ({name: item, label: categoriesWithLabel.labels[i]})
        })
        return res.json({success: true, method: "get", categories, categoriesWithLabel})
    }
    catch(e){ return res.status(500).json({success: false, message: e.message})}
})

router.get('/category/:category', verifyToken, async(req, res) => {
    const {category} = req.params
    try{
        const foods = await prisma.foodItem.findMany({
            where: {category}
        })

        const result = {
            foods,
            count: foods.length
        }

        return res.json({success: true, categoryDetail:result})
    } catch(e) {
        return res.status(500).json({success: false, message: e.message})
    }
})

// Get a specific foods infomation
router.get('/:id', async (req, res) =>{
    const id = req.params.id
    try {
        const food = await prisma.foodItem.findFirst({where: {id}, include: {foodIngredient: true}})

        return res.json({success: true, method: "get", food})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, method: "post", message: `${e.meta.target} not found`})
            }
        }
        return res.status(401).json({success: false, method: "post", message: e.message})
    }
} )


// Create a new food item
router.post('/', verifyToken ,upload.single("image"),  async (req, res) =>{
    let {name, price, sale_price, description, state, category} = req.body
    let {uid} = req.body;
    if (!(await checkPermission(uid, ["admin"]))) throw new Error("Permission denied");

    const ingredients = req.body.ingredients // ingredients : [{id, amount}]
    // If ingredients are posted, create a connect for many-many table
    let connectIngredient;
    if(ingredients) connectIngredient = {
        foodIngredient: {
            create: ingredients.map((ing) => ({amount: ing.amount, ingredient: {connect: {id: ing.id}}}))
        }
    }

    //Images handler


    const imageFile = req.file
    try {
        price = parseFloat(price)
        sale_price = sale_price !== "" ? parseFloat(sale_price) : price
        let newFood = {
            name, price, sale_price, description, state, category
        }

        let queryRes = await prisma.foodItem.create({
            data: {...newFood, ...connectIngredient}, include: {foodIngredient: true}})
        // Image upload
        if (imageFile)
        {
            const {path} = imageFile;
            const fileBuffer = fs.readFileSync(path)
            const fileStream = streamifier.createReadStream(fileBuffer);
            const image = await cloudinary.upload(fileStream, "foodItem", queryRes.id);
            fs.unlinkSync(path);
            queryRes = await prisma.foodItem.update({where: {id: queryRes.id}, data: {image: image}})
        }

        
        return res.json({success: true, method: "post", food: queryRes})
    }
    catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2002') {
                return res.status(404).json({success: false, method: "put", message: `Violent unique constraint, ${e.meta.target} already existed`})
            }
        }
        return res.status(401).json({success: false, method: "put", message: e.message})
    }
} )

// Update food information
router.put('/:id', verifyToken ,upload.single("image"), async (req, res) => {
    let {name, price, sale_price, description, state, category} = req.body
   
    const ingredients = req.body.ingredients // ingredients : [{id, amount}]
    const {id} = req.params

    const imageFile = req.file
    // If ingredients are posted, create a connect for many-many table
    let connectIngredient = {};
    if(ingredients) {
        await prisma.foodIngredient.deleteMany({where: {foodId: id}})
        connectIngredient = {
            foodIngredient: {
                create: ingredients.map((ing) => (
                    {amount: ing.amount, ingredient: {connect: {id: ing.id}}})
                )
            }
        }
    }
    try{
        
        price = parseFloat(price)
        sale_price = sale_price !== "" ? parseFloat(sale_price) : price

        let queryRes = await prisma.foodItem.update({
            where: {
                id
            },
            data: {
                name: name ? name : undefined,
                price: price ? price : undefined,
                sale_price: sale_price ? sale_price : undefined,
                description: description ? description : undefined,
                state: state ? state : undefined,
                category: category ? category : undefined,
                // Catch food ingredient size and undefined
                ...connectIngredient
            }, include: {foodIngredient: true}
        })

        if (imageFile)
        {
            const {path} = imageFile;
            const fileBuffer = fs.readFileSync(path)
            const fileStream = streamifier.createReadStream(fileBuffer);
            const image = await cloudinary.upload(fileStream, "foodItem", queryRes.id);
            fs.unlinkSync(path);
            queryRes = await prisma.foodItem.update({where: {id: queryRes.id}, data: {image: image}})
        }

        return res.json({success: true, method: "put", food: queryRes})
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
// Delete a food item
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    try{
        const delTarget = prisma.foodItem.delete({
            where: {
                id: id
            }
        })

        const delFoodIngredient = prisma.foodIngredient.deleteMany({
            where: {
                foodId: id
            }
        })

        await prisma.$transaction([delFoodIngredient, delTarget])

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