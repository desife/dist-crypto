const express = require("express");
const app = express();

const router = require("./routes/router.js");
const port = 8001;

app.set("view engine", "ejs");
app.set("views", __dirname + "/");

app.use(express.static(__dirname + "/"));
app.use(router);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
// eslint-disable-line no-console
