const UserService = require('../../services/user');
const { generateToken } = require('../middlewares/authentication');

module.exports = {
    login: async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const user = await UserService.login(email, password);
            if (user) {
                const accessToken = generateToken(user);
                res.status(200).json({ token: accessToken });
            } else {
                res.status(401).json({ "message": 'Invalid credentials' });
                console.log(`Invalid credentials ${email}:${password}`);
            }
        } catch (err) {
            res.status(500).json({ "message": `error: ${err.message}` });
            console.log(err.message);
        }
    },

    createUser: async (req, res, next) => {
        let { name, email, password } = req.body;
        let isAdmin = 0;

        try {
            // Do not forget the await keyword otherwise you get a promise rather than an object
            const user = await UserService.createUser(name, email, password, isAdmin);
            const accessToken = generateToken(user);
            res.status(200).json({ token: accessToken });
            // res.status(201).json(user); // 201: Created
            console.log("user created");
        } catch (err) {
            res.status(500).json({ "message": `error: ${err.message}` });
            console.log(err.message);
        }
    },

    getUsers: async (req, res, next) => {
        try {
            const users = await UserService.getUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ "message": `Request for all users caused an error` });
            console.log(err.message);
        }
    },

    getUser: async (req, res, next) => {
        const userId = req.params.id;
        try {
            const user = await UserService.getUser(userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ "message": "NotFound" }); // 404: Not found
            }
        } catch (err) {
            res.status(500).json({ "message": `Request for id ${userId} caused an error` });
            console.log(err.message);
        }
    },

    updateUser: async (req, res, next) => {
        const userId = req.params.id;
        const { name, email, password, phoneNumber, birthDate } = req.body;
        const isAdmin = 0;
        try {
            const user = await UserService.getUser(userId);
            if (user) {
                const updatedUser = await UserService.updateUser(userId, name, email, password, isAdmin, phoneNumber, birthDate);
                res.json(updatedUser);
            } else {
                res.status(404).json({ "message": `User with id ${userId} does not exist` });
                console.log(`User with id ${userId} does not exist`);
            }
        } catch (err) {
            res.status(500).end(`Request for updating userId ${userId} caused an error ${err.message}`);
        }
    },

    // updateUserPassword: async (req, res, next) => {
    //     const userId = req.params.id;
    //     const { currPassword, newPassword } = req.body;
    //     try {
    //         const user = await UserService.getUser(userId);
    //         if (user) {
    //             const updatedUserPassword = await UserService.updateUserPassword(userId,currPassword, newPassword);
    //             res.json(updatedUserPassword);
    //         } else {
    //             res.status(404).json({ "message": `User with id ${userId} does not exist` });
    //             console.log(`User with id ${userId} does not exist`);
    //         }
    //     } catch (err) {
    //         res.status(500).end(`Request for updating userId ${userId} caused an error ${err.message}`);
    //     }
    // }
};