const {Router} = require('express');
const router = Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/userAuth');



router.post('/signup' ,async (req,res)=>{
    userController.signupController(req,res);
});

router.post('/login', async (req, res) => {
    userController.loginController(req, res);
});

router.get('/logout', async (req, res) => {
    userController.logoutController(req, res);
});

router.get('/profile',auth, async (req, res) => {
    userController.profileController(req, res);
});

router.get('/all',auth,async (req,res)=>{
    userController.getAllUserController(req,res);
})
router.get("/:id",auth,async (req,res)=>{
    userController.getUserByIdController(req,res);
})



router.post('/send-otp', async (req, res) => {
    userController.sendOtpController(req, res);
});


router.post('/reset-password', async (req, res) => {
    userController.resetPasswordController(req, res);
});

module.exports = router;