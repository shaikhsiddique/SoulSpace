const {userModel} = require('../models/user.model');


const createUserService = async (data) => {
    const { username, email, phone, password } = data;

    if (!username || !email || !phone || !password ) {
        throw new Error('All fields are required');
    }

    try {
        const user = await userModel.create({
            username,
            email,
            phone,
            password,
            
        });
        return user;
    } catch (err) {
        throw new Error('Error creating user: ' + err.message);
    }
};

const findUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({email})
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
}

const deleteUserById = async (id) => {
    try {
        const user = await userModel.findByIdAndDelete(id);
        return user;
    } catch (err) {
        throw new Error('Error finding user: ' + err.message);
    }
}

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



module.exports = { createUserService, findUserByEmail, findAllUsers ,findUserById ,updateUserService ,deleteUserById };
