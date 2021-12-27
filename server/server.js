var appModulePath = require("app-module-path");
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");
var fse = require("fs-extra");
const { spawn } = require("child_process");

appModulePath.addPath(`${__dirname}`);

const app = express();
const HTTP = http.Server(app);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/test", (req, res) => res.status(200).send("success!"));

const image_name = "image.jpg";

var base64ToImage = (req, res, next) => {
  var base64Data = req.body.image;
  console.log(process.cwd());
  fs.writeFile(
    // for windows development
    process.cwd() + `\\server\\u2net\\images\\${image_name}`,

    // for linux development and final deployment
    // `u2net/images/${image_name}`,

    base64Data,
    "base64",
    function (err) {
      if (err) {
        console.log(err);
      } else {
      }
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

  const segmentation = spawn("python", ["segment.py"]);

  segmentation.on("close", (code) => {
    // res.write(image_name.replace("jpg", "png"));
    console.log(`child process close all stdio with code ${code}`);

    const classification = spawn("python", ["inference.py"]);

    classification.stdout.on("data", (data) => {
      res.send(`image.png ${data.toString()}`);
      console.log(`Retrieving the data from inference.py: ${data.toString()}`);
    });

    classification.on("close", (code) => {
      console.log("Executed");

      const images_folder = process.cwd() + "/u2net/images";
      const results_folder = process.cwd() + "/u2net/results";
      // const output_folder = process.cwd() + "/output";

      fse.emptyDir(images_folder, (err) => {
        if (err) return console.error(err);
      });

      fse.emptyDir(results_folder, (err) => {
        if (err) return console.error(err);
      });
    });
  });
});

HTTP.listen(9000, () => {
  console.log("listening on Port: 9000");
});
