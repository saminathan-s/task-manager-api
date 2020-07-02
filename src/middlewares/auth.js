const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const decodedData = jwt.verify( token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:decodedData._id, 'tokens.token':token});
        if(!user){
            throw new Error();
        }
        req.user=user;
        req.token=token;
        next();
    }catch(e){
        res.status(401).send({error:'Please Authenticate'});
    }
}

module.exports = auth;