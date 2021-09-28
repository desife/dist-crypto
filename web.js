const express = require("express");
const app = express();

const router = require("./routes/router.js");

app.set("view engine", "ejs");
app.set("views", __dirname + "/");

app.use(express.static(__dirname + "/"));
app.use(router);

app.set("port", process.env.PORT || 8001);
app.listen(app.get("port"), function () {
  console.log("APP IS RUNNING ON [" + app.get("port") + "]");
});
// eslint-disable-line no-console
