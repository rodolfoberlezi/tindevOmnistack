const Dev = require("../models/Dev");

module.exports = {
    async store(req, res) {
        const { user } = req.headers;
        const { id } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(id); //usuário que recebeu Like

        if (!targetDev) {
            return res.status(400).json({ error: "Dev does not exists" });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            console.log("It's a match!");
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[id];

            //informa para cada socket com quem deu match
            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }

            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
}