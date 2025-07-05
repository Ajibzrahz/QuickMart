import jwt from "jsonwebtoken"


const authenticate = (req, res, next) => {
    const { userToken } = req.cookies
    if (!userToken) {
        res.send("No token provided, login first")
    }
    //verifying the token
    try {
        const decode = jwt.verify(userToken, process.env.JWT_SECRET)
        req.customer = {id:decode.id, role: decode.role }
    } catch (error) {
        res.json({message : "invalid Token"})
    }
    
    next();
}

export default authenticate