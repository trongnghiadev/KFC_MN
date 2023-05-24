const jwt = require('jsonwebtoken');
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token)
        return res.status(401).json({ success: false, message: 'Token not found' });
    try {
        const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decodedToken.userId;
        req.user = await prisma.user.findUnique({where: {id : req.userId}})
        next();
    } catch (error) {
        console.error(error.message)
        res.status(403).json({ success: false, message: "Invalid token" })
    }
}

module.exports = verifyToken;