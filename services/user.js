const mongoose = require('mongoose');
const UserModel = require('../models/User');
const bcrypt = require("bcryptjs");

// From here, you might even connect to something different than MongoDB, like SQL:
// https://stackoverflow.com/questions/30356148/how-can-i-use-a-single-mssql-connection-pool-across-several-routes-in-an-express 

// Now this service is providing whatever is needed to interact with the database but at the same time
// validating the BLL requirements.
const login = async (email, password) => {
    // const user = await UserModel.findOne({ email: email, password: password });
    // if (user) return user;
    // return null;

    let user = await UserModel.findOne({ email: email });
    if (user) {
        let success = bcrypt.compareSync(password, user.password);
        if (success === true)
            return user;
        else
            return null;
    }
    return null;
};


const createUser = async (name, email, password, isAdmin) => {
    const user = new UserModel({ name: name, email: email, password: password, isAdmin: isAdmin});

    // All validation, checks, further tasks (sending emails, etc.) must happen here.
    const newUser = await user.save();
    return newUser;
};

const getUsers = async () => {
    const users = await UserModel.find({});
    return users;
};

const getUser = async (id) => {
    const user = await UserModel.findById(id);
    return user;
};

const updateUser = async (id, name, email, password, isAdmin, phoneNumber, birthDate) => {
    const user = await UserModel.findById(id);
    user.name = name;
    user.email = email;
    user.password = password;
    user.isAdmin = isAdmin;
    if(phoneNumber) user.phoneNumber = phoneNumber;
    if(birthDate) user.birthDate = birthDate;

    await user.save();
    return user;
}

// const updateUserPassword = async (id, currPassword, newPassword) => {
//     let user = await UserModel.findById(id);
//     let success = bcrypt.compareSync(currPassword, user.password);
//     if (success === true){
//         user.password = newPassword;
//         await user.save();
//         return user;
//     }
//     else
//         return user;

// }


module.exports = {
    login,
    createUser,
    getUsers,
    getUser,
    updateUser,
    // updateUserPassword
};
