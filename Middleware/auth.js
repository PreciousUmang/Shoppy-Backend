import jwt from "jsonwebtoken"

const auth = (req, res, next) =>{
    const authHeader= req.headers.authorization;
    console.log(authHeader)

    if(!authHeader){
        console.log("Authorization Header is Missing");
        return res.status(401).json({message:'Authorization Token is Missing'})
    }

    const token = authHeader.split(" ")[1]
    console.log("Extracted Token:", token);

    try{
        const decoded = jwt.verify(token, "Precious!23")
        req.userId = decoded.userId;
        next();
    }catch(error){

        console.error("Token Verification Error:", error.message);


        res.status(403).json({message:'Invalid or Expired Token'})
    }

}


export default auth;