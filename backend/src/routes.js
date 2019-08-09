const express = require("express");
const devController = require("../src/controllers/DevController");
const likeController = require("../src/controllers/LikeController");
const dislikeController = require("../src/controllers/DislikeController");

const routes = express.Router();

routes.get('/devs', devController.index);
routes.post('/devs', devController.store);

routes.post('/devs/:id/likes', likeController.store);
routes.post('/devs/:id/dislikes', dislikeController.store);

module.exports = routes;