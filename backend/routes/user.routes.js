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

// Assessment routes (must be before /:id route to avoid conflicts)
router.post('/assessment', auth, async (req, res) => {
    userController.createAssessmentController(req, res);
});

router.get('/assessments', auth, async (req, res) => {
    userController.getUserAssessmentsController(req, res);
});

// Journal routes (also before /:id route)
router.post('/journals', auth, async (req, res) => {
    userController.createJournalEntryController(req, res);
});

router.get('/journals', auth, async (req, res) => {
    userController.getUserJournalsController(req, res);
});

router.delete('/journals/:journalId', auth, async (req, res) => {
    userController.deleteJournalEntryController(req, res);
});

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