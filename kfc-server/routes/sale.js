const {PrismaClient, Prisma} = require("@prisma/client")

const express = require("express")

const verifyToken = require("../middleware/auth");

const router = express.Router()

const prisma = new PrismaClient();

const {DateTime} = require('luxon')

// Get facilities units
router.get('/cart', verifyToken, async (req, res) =>{
    try {
        const cart = await prisma.receipt.create({
            data: {}
        })
        return res.json({success: true, cartId: cart.id})
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

router.post('/cart', verifyToken, async (req, res)=> {
    try{
        const {foods, cartId, paymentMethod} = req.body;
        let receipt = await prisma.receipt.findUniqueOrThrow({where: {id: cartId}})

        const dataList = foods.map((food)=>({
            id: cartId, foodId: food.id, amount: food.amount
        }))

        const receipt_Detail = await prisma.receipt_Detail.createMany({
            data: dataList
        })

        receipt = await prisma.receipt.update({where: {id: cartId}, data: {state: "paid", paymentMethod: paymentMethod}, include: {Receipt_Detail: true}})

        return res.json({success: true, receipt})
        
    }
    catch (e) {
        
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === 'P2001') {
                return res.status(404).json({success: false, message: `${e.meta.target} not found`})
            }
            if (e.code === 'P2025') {
                return res.status(404).json({success: false, message: `${e.meta.target} not found`})
            }
        }
        return res.status(500).json({success: false, message: e.message})
    }
})

router.head("/cart/:id", verifyToken, async (req) =>{
    const {id} = req.params
    const {action} = req.query
    
    await prisma.receipt.update({
        where: {id},
        data: {state: action}
    })

})


router.patch("/order/:id", verifyToken, async (req, res) =>{
    const {id} = req.params
    const {action} = req.query
    
    await prisma.receipt.update({
        where: {id},
        data: {state: action}
    })

    
    return res.json({success: true})
})

router.get("/orders/", verifyToken, async(req, res)=>{
    const now = DateTime.local();
    const vnTime = now.setZone("Asia/Ho_Chi_Minh")
    const startOfDay = vnTime.startOf('day').toJSDate()
    const endOfDay = vnTime.endOf('day').toJSDate()
    const {filter} = req.query
    try{
        let orders = await prisma.receipt.findMany({
            where : {
                    NOT: [{state: "pending"}]
                },
            include: {
                Receipt_Detail: {
                    select: {
                        food: true,
                        amount: true
                    }
                },
            }
        })
        
        if(filter == "getToday")
            // Lọc chỉ lấy order từ ngày được query
            orders = orders.filter((order, i)=>{

                // Get only today
                const createAt = DateTime.fromJSDate(new Date(order.create_at), { zone: 'utc' }).setZone('Asia/Ho_Chi_Minh');
                return createAt >= startOfDay && createAt < endOfDay && order.Receipt_Detail.length > 0;
            })
            .map((order)=>{
                // Add new props name food for fe to render
                order.foods = order.Receipt_Detail.map(f => ({...f.food, amount: f.amount}))
                order.total = order.Receipt_Detail.reduce((sum, f) => sum + f.food.sale_price * f.amount, 0)
                return order
            }).sort((r1, r2) => {
                // Sort by state
                let s1 = r1.state == "paid" ? 1 : r1.state == "done" ? 2 : 3;
                let s2 = r2.state == "paid" ? 1 : r2.state == "done" ? 2 : 3;
                // Sort by time
                if (s1 == s2) {
                    const d1 = new Date(r1.create_at)
                    const d2 = new Date(r2.create_at)
                    s1 += d1 > d2 ? -1 : 1;
                }
                
                return s1 - s2
            })
        else if (filter == "getAll")
            orders = orders.map((order)=>{
                // Add new props name food for fe to render
                order.foods = order.Receipt_Detail.map(f => ({...f.food, amount: f.amount}))
                order.total = order.Receipt_Detail.reduce((sum, f) => sum + f.food.sale_price * f.amount, 0)
                return order
            }).sort((r1, r2) => {
                // Sort by state
                let s1 = r1.state == "paid" ? 1 : r1.state == "done" ? 2 : 3;
                let s2 = r2.state == "paid" ? 1 : r2.state == "done" ? 2 : 3;
                // Sort by time
                if (s1 == s2) {
                    const d1 = new Date(r1.create_at)
                    const d2 = new Date(r2.create_at)
                    s1 += d1 > d2 ? -1 : 1;
                }
                
                return s1 - s2
            })

        return res.json({success: true, orders})
    } catch (e) {
        return res.status(500).json({success: false, message: e.message})
    }
})

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

module.exports = router