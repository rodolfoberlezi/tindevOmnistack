const Dev = require("../models/Dev");

module.exports = {
    async store(req, res) {
        const { user } = req.headers;
        const { id } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(id); //usuário que recebeu Dislike

        if (!targetDev) {
            return res.status(400).json({ error: "Dev does not exists" });
        }

        loggedDev.dislikes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
}