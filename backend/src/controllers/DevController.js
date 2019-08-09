const axios = require("axios");
const Dev = require("../models/Dev");

//controllers podem ser apenas um objeto com no máximo 5 métodos
//INDEX, SHOW, STORE, UPDATE, DELETE
//isto é uma boa prática
module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } }, //not equal
                { _id: { $nin: loggedDev.likes } }, //not in, not included
                { _id: { $nin: loggedDev.dislikes } }
            ]
        });

        return res.json(users);
    },

    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if (userExists) {
            console.log(`User ${userExists.name} already exists`);
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        });

        console.log(`User ${dev.name} has been successfully created`);
        return res.json(dev);
    }
}