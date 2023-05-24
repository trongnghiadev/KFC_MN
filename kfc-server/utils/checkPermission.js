const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async function (id, expected = []) {
    const {role} = await prisma.user.findUnique({where: {id}})
    if (expected.includes(role)) {
        return true;
    }
    return false;
}