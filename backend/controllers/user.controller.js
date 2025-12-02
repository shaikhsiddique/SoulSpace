const { userModel, validateUserModel } = require('../models/user.model');

const  { hashPassword, comparePassword } = require('../utils/hash-password');
const { createToken, verifyToken } = require('../utils/jwt');
const userService = require('../service/user.service');
const  redisClient  = require('../service/redis.service');

// Domain mapping for emotions
const domainToEmotion = {
    'stress': 'stress',
    'anxiety': 'anxiety',
    'depression': 'sadness',
    'sleep': 'restlessness',
    'selfEsteem': 'insecurity',
    'anger': 'anger',
    'loneliness': 'loneliness'
};

// Domain names for topics
const domainNames = {
    'stress': 'stress',
    'anxiety': 'anxiety',
    'depression': 'depression',
    'sleep': 'sleep issues',
    'selfEsteem': 'self-esteem',
    'anger': 'anger',
    'loneliness': 'loneliness'
};

const signupController = async (req, res) => {
    try {
      const { error } = validateUserModel(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      const { username, email, phone, password, age, gender } = req.body;
  
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(500).json({ error: 'User with this email already exists' });
      }
  
      const hashedPassword = await hashPassword(password);
  
      const user = await userService.createUserService({
        username,
        email,
        phone,
        password: hashedPassword,
        age,
        gender
      });
  
      const token = await createToken({ id: user._id, email: user.email });
  
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 60 * 60 * 1000,
      });
  
      res.status(201).json({
        message: 'User created successfully',
        user: { ...user.toObject(), password: undefined },
        token
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: 'An error occurred during registration',
        details: err.message
      });
    }
  };
  
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await userService.findUserByEmail(email)
        if (!user) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const token = await createToken({ id: user._id, email: user.email });

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            user: { ...user.toObject(), password: undefined },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const profileController = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userdata = await userService.findUserByEmail(user.email);
        

        if (!userdata.username || !userdata.email || !userdata.phone) {
            return res.status(400).json({ error: 'Incomplete user profile data' });
        }

        delete userdata.password;

        res.status(200).json({
            message: 'User profile fetched successfully',
            user: userdata
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const logoutController = async (req, res) => {
    try {
        const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided. Logout failed.",
            });
        }

        await redisClient.set(token, "logout", "EX", 5 * 60 * 60);

        res.clearCookie('authToken', { httpOnly: true, secure: true });

        res.status(200).json({
            success: true,
            message: "Logout successful.",
        });

        req.user = null;
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const getAllUserController = async (req, res) => {
    try {
        const loggedInUser = req.user; 
        const allUsers = await userService.findAllUsers();

        // Filter out the logged-in user
        const filteredUsers = allUsers.filter(user => user._id.toString() !== loggedInUser._id.toString());

        res.json({ success: true, users: filteredUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const getUserByIdController = async (req,res) => {
    try {
        const id = req.params.id;
    if(!id){
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    const user = await userService.findUserById(id);
    res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }


}

const sendOtpController = async (req, res) => {
    try {
        const { email, phone } = req.body;
        
        if (!email && !phone) {
            return res.status(400).json({ error: 'Email or phone number is required' });
        }

        let user;
        if (email) {
            user = await userService.findUserByEmail(email);
        } else {
            user = await userModel.findOne({ phone });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(`otp:${user._id}`, otp, 'EX', 300);

        if (email) {
            const emailBody = `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`;
            sendEmail(email, emailBody, 'Password Reset OTP');
        } else if (phone) {
            const message = `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`;
            await sendMessage(message, `+91${phone}`);
        }

        res.status(200).json({ 
            otp: otp,
            message: 'OTP sent successfully',
            userId: user._id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

const resetPasswordController = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await hashPassword(newPassword);
        const updatedUser = await userService.updateUserService(userId, { password: hashedPassword });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

// Helper function to process assessment data and convert to testSchema format
const processAssessmentData = (assessmentData) => {
    const { domainAnswers, selectedDomain, severityAnswers } = assessmentData;

    // Calculate average domain score
    const avgDomainScore = domainAnswers && domainAnswers.length > 0
        ? domainAnswers.reduce((sum, val) => sum + (val || 0), 0) / domainAnswers.length
        : 0;

    // Calculate average severity score
    const avgSeverityScore = severityAnswers && severityAnswers.length > 0
        ? severityAnswers.reduce((sum, val) => sum + (val || 0), 0) / severityAnswers.length
        : 0;

    // Determine sentiment based on scores
    let sentiment = 'neutral';
    if (avgDomainScore >= 4 || avgSeverityScore >= 4) {
        sentiment = 'negative';
    } else if (avgDomainScore <= 2 && avgSeverityScore <= 2) {
        sentiment = 'positive';
    }

    // Map selected domain to emotion
    const emotion = domainToEmotion[selectedDomain] || selectedDomain || 'neutral';

    // Determine risk level based on severity scores
    let risk_level = 'low';
    if (avgSeverityScore >= 4.5) {
        risk_level = 'emergency';
    } else if (avgSeverityScore >= 3.5) {
        risk_level = 'high';
    } else if (avgSeverityScore >= 2.5) {
        risk_level = 'medium';
    }

    // Extract topics from domains with high scores (>= 3)
    const topics = [];
    const domainKeys = ['stress', 'anxiety', 'depression', 'sleep', 'selfEsteem', 'anger', 'loneliness'];
    if (domainAnswers && domainAnswers.length >= 7) {
        domainKeys.forEach((domain, index) => {
            if (domainAnswers[index] >= 3) {
                topics.push(domainNames[domain] || domain);
            }
        });
    }
    
    // Always include the selected domain as a topic
    if (selectedDomain && !topics.includes(domainNames[selectedDomain])) {
        topics.unshift(domainNames[selectedDomain] || selectedDomain);
    }

    // Generate summary
    const summary = `Assessment focused on ${domainNames[selectedDomain] || selectedDomain || 'mental wellness'} with ${risk_level} risk level. Average domain score: ${avgDomainScore.toFixed(1)}/5.`;

    return {
        sentiment,
        emotion,
        risk_level,
        topics: topics.length > 0 ? topics : [domainNames[selectedDomain] || selectedDomain || 'general wellness'],
        summary,
        selectedDomain: selectedDomain || null,
        date: new Date()
    };
};

// Create assessment controller
const createAssessmentController = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        const { domainAnswers, selectedDomain, severityAnswers } = req.body;

        // Validate required fields
        if (!domainAnswers || !Array.isArray(domainAnswers)) {
            return res.status(400).json({ error: 'Domain answers are required and must be an array' });
        }

        if (!selectedDomain) {
            return res.status(400).json({ error: 'Selected domain is required' });
        }

        if (!severityAnswers || !Array.isArray(severityAnswers)) {
            return res.status(400).json({ error: 'Severity answers are required and must be an array' });
        }

        // Process assessment data
        const assessmentData = processAssessmentData({
            domainAnswers,
            selectedDomain,
            severityAnswers
        });

        // Add assessment to user
        const newAssessment = await userService.addAssessmentToUser(user._id, assessmentData);

        res.status(201).json({
            message: 'Assessment created successfully',
            assessment: newAssessment
        });

    } catch (error) {
        console.error('Error creating assessment:', error);
        res.status(500).json({
            error: 'Failed to create assessment',
            details: error.message
        });
    }
};

// Get all assessments for a user
const getUserAssessmentsController = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        const assessments = await userService.getUserAssessments(user._id);

        res.status(200).json({
            message: 'Assessments fetched successfully',
            assessments: assessments,
            count: assessments.length
        });

    } catch (error) {
        console.error('Error fetching assessments:', error);
        res.status(500).json({
            error: 'Failed to fetch assessments',
            details: error.message
        });
    }
};

// -------- JOURNAL CONTROLLERS --------

// Create/Add a journal entry
const createJournalEntryController = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        const { content } = req.body;
        if (!content || typeof content !== 'string') {
            return res.status(400).json({ error: 'Journal content is required' });
        }

        const journalEntry = await userService.addJournalEntry(user._id, content);

        res.status(201).json({
            message: 'Journal entry created successfully',
            journal: journalEntry
        });
    } catch (error) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({
            error: 'Failed to create journal entry',
            details: error.message
        });
    }
};

// Get all journal entries for the logged-in user
const getUserJournalsController = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        const journals = await userService.getUserJournals(user._id);

        res.status(200).json({
            message: 'Journals fetched successfully',
            journals,
            count: journals.length
        });
    } catch (error) {
        console.error('Error fetching journals:', error);
        res.status(500).json({
            error: 'Failed to fetch journals',
            details: error.message
        });
    }
};

// Delete a specific journal entry
const deleteJournalEntryController = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        const { journalId } = req.params;
        if (!journalId) {
            return res.status(400).json({ error: 'Journal ID is required' });
        }

        await userService.deleteJournalEntry(user._id, journalId);

        res.status(200).json({
            message: 'Journal entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({
            error: 'Failed to delete journal entry',
            details: error.message
        });
    }
};


 module.exports = {
    loginController,
    signupController,
    profileController,
    logoutController,
    getAllUserController,
    getUserByIdController,
    sendOtpController,
    resetPasswordController,
    createAssessmentController,
    getUserAssessmentsController,
    createJournalEntryController,
    getUserJournalsController,
    deleteJournalEntryController
};
