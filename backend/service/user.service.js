const { userModel } = require('../models/user.model');


const createUserService = async (data) => {
    const { username, email, phone, password, age, gender } = data;
  
    if (!username || !email || !phone || !password || !age || !gender) {
      throw new Error('All fields are required');
    }
  
    try {
      const user = await userModel.create({
        username,
        email,
        phone,
        password,
        age,
        gender
      });
  
      return user;
    } catch (err) {
      throw new Error('Error creating user: ' + err.message);
    }
};
  

const findUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({ email });
        return user;
    } catch (err) {
        throw new Error('Error finding user: ' + err.message);
    }
};

const findUserById = async (id) => {
    try {
        const user = await userModel.findById(id);
        return user;
    } catch (err) {
        throw new Error('Error finding user: ' + err.message);
    }
};

const deleteUserById = async (id) => {
    try {
        const user = await userModel.findByIdAndDelete(id);
        return user;
    } catch (err) {
        throw new Error('Error finding user: ' + err.message);
    }
};

const findAllUsers = async () => {
    try {
        const users = await userModel.find();
        return users;
    } catch (err) {
        throw new Error('Error fetching users: ' + err.message);
    }
};

const updateUserService = async (userId, updateData) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
        return updatedUser;
    } catch (err) {
        console.error('Error updating user:', err);
        throw new Error('Failed to update user');
    }
};

// Add assessment to user's tests array
const addAssessmentToUser = async (userId, assessmentData) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Push the new assessment to the tests array
        user.tests.push(assessmentData);
        await user.save();

        // Return the newly added assessment (last one in array)
        return user.tests[user.tests.length - 1];
    } catch (err) {
        console.error('Error adding assessment:', err);
        throw new Error('Failed to add assessment: ' + err.message);
    }
};

// Get all assessments for a user
const getUserAssessments = async (userId) => {
    try {
        const user = await userModel.findById(userId).select('tests');
        if (!user) {
            throw new Error('User not found');
        }

        // Return tests sorted by date (newest first)
        return user.tests.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
        console.error('Error fetching assessments:', err);
        throw new Error('Failed to fetch assessments: ' + err.message);
    }
};

// -------- JOURNAL SERVICES --------

// Add a journal entry for a user
const addJournalEntry = async (userId, content) => {
    try {
        if (!content || typeof content !== 'string') {
            throw new Error('Journal content is required');
        }

        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.journals.push({ content });
        await user.save();

        return user.journals[user.journals.length - 1];
    } catch (err) {
        console.error('Error adding journal entry:', err);
        throw new Error('Failed to add journal entry: ' + err.message);
    }
};

// Get all journal entries for a user
const getUserJournals = async (userId) => {
    try {
        const user = await userModel.findById(userId).select('journals');
        if (!user) {
            throw new Error('User not found');
        }

        // Sort journals by date (newest first)
        return user.journals.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
        console.error('Error fetching journals:', err);
        throw new Error('Failed to fetch journals: ' + err.message);
    }
};

// Delete a specific journal entry
const deleteJournalEntry = async (userId, journalId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const journal = user.journals.id(journalId);
        if (!journal) {
            throw new Error('Journal entry not found');
        }

        journal.deleteOne();
        await user.save();

        return true;
    } catch (err) {
        console.error('Error deleting journal entry:', err);
        throw new Error('Failed to delete journal entry: ' + err.message);
    }
};


module.exports = { 
    createUserService, 
    findUserByEmail, 
    findAllUsers, 
    findUserById, 
    updateUserService, 
    deleteUserById,
    addAssessmentToUser,
    getUserAssessments,
    addJournalEntry,
    getUserJournals,
    deleteJournalEntry
};


