const { signup, login ,forgotPassword,ResetPassword,getUsers } = require('../Controllers/AuthController');
const { signupValidation, loginValidations } = require('../Middleware/AuthValidation');

const router = require('express').Router();

router.post('/login', loginValidations, login);
router.post('/signup', signupValidation, signup);
router.post("/forgotpassword", forgotPassword);
router.post("/reset-password", ResetPassword);
router.get('/getuser', getUsers);

module.exports = router;