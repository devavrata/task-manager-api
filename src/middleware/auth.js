const jwt = require('jsonwebtoken')
const User = require('../model/user')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne( {_id: decoded._id, 'tokens.token': token})
        //even is user token not present the user will return as null or undefined and we should check that
        if(!user || user==='null'){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()    
    }catch(e){
        res.status(401).send('Please authenticate.')
    }
}

module.exports = auth