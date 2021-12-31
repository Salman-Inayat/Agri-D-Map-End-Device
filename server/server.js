import { PythonShell } from "python-shell";
var appModulePath = require("app-module-path");
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");
var fse = require("fs-extra");
var path = require("path");

appModulePath.addPath(`${__dirname}`);

const app = express();
const HTTP = http.Server(app);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "output")));

app.get("/test", (req, res) => res.status(200).send("success!"));

const image_name = "image.jpg";

var base64ToImage = (req, res, next) => {
  var base64Data = req.body.image;
  fs.writeFile(
    // for windows development
    process.cwd() + `\\server\\u2net\\images\\${image_name}`,

    // for linux development and final deployment
    // `u2net/images/${image_name}`,

    base64Data,
    "base64",
    function (err) {
      console.log(err);
    }
  );
  next();
};

app.get("/", (req, res) => {
  res.send("Hello again");
});

app.post("/image-segment", base64ToImage, (req, res) => {
  const image = req.body.image;

  if (!image) {
    return res.status(400).send({ message: "Please upload an image." });
  }

  let segmentation = new PythonShell("./server/segment.py");

  // end the input stream and allow the process to exit
  segmentation.end(function (err, code, signal) {
    let classification = new PythonShell("./server/inference.py");

    classification.on("message", function (message) {
      // received a message sent from the Python script (a simple "print" statement)
      res.send(`image.png ${message.toString()}`);
      console.log("Result: ", message.toString());
    });

    // end the input stream and allow the process to exit
    classification.end(function (err, code, signal) {
      if (err) throw err;
      console.log("The exit code was: " + code);

      const images_folder = process.cwd() + "/server/u2net/images";
      const results_folder = process.cwd() + "/server/u2net/results";

      fse.emptyDir(images_folder, (err) => {
        if (err) return console.error(err);
      });

      fse.emptyDir(results_folder, (err) => {
        if (err) return console.error(err);
      });
    });

    if (err) throw err;
    console.log("The exit code was: " + code);
  });
});

HTTP.listen(4000, () => {
  console.log("listening on Port: 4000");
});
