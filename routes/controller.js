const Scheduler = require("../server/schedule");
const scheduler = new Scheduler();

exports.main = async (req, res, next) => {
  res.render("../public/views/main");
};

exports.uNews_start = (req, res, next) => {
  scheduler.uNews_start();
  res.render("../public/views/main");
};

exports.uNews_stop = (req, res, next) => {
  scheduler.uNews_stop();
  res.render("../public/views/main");
};

exports.cNews_start = (req, res, next) => {
  scheduler.cNews_start();
  res.render("../public/views/main");
};

exports.cNews_stop = (req, res, next) => {
  scheduler.cNews_stop();
  res.render("../public/views/main");
};

exports.news_stop = (req, res, next) => {
  scheduler.news_stop();
  res.render("../public/views/main");
};
