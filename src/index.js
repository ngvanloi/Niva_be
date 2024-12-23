const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(bodyParser.json())
routes(app)

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("====================================");
    console.log("Connect db success");
    console.log("====================================");
  })
  .catch((err) => {
    console.log("====================================");
    console.log("Error :" + err);
    console.log("====================================");
  });


app.listen(port, () => {
  console.log("====================================");
  console.log("Server is running in PORT " + port);
  console.log("====================================");
});
