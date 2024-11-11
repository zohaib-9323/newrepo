const joi = require('joi');

const signupValidation = (req, res ,next)=>{
    const schema = joi.object({
        firstName: joi.string().min(2).max(20).required(),
        lastName: joi.string().min(2).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}
const loginValidations = (req,res,next)=>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }else{
        next();
    }
}

module.exports = {signupValidation, loginValidations};