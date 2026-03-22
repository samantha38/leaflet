const express = require("express");
const router = express.Router();

const routeController = require("../controllers/routeController");

router.get("/autocomplete", routeController.autocomplete);
router.post("/find-route", routeController.findRoute);

module.exports = router;