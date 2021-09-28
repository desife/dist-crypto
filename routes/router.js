const router = require("express").Router();
const controller = require("./controller");

/* GET home page. */
router.get("/", controller.main);

router.get("/upbit/start", controller.uNews_start);
router.get("/upbit/stop", controller.uNews_stop);

router.get("/coinness/start", controller.cNews_start);
router.get("/coinness/stop", controller.cNews_stop);

router.get("/news/stop", controller.news_stop);

module.exports = router;
