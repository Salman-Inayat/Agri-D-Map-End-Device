var express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");
var fse = require("fs-extra");

var vari_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "vari/input");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

var vari_upload = multer({ storage: vari_storage });

const image_name = "image.jpg";

var base64ToImage = (req, res, next) => {
  var base64Data = req.body.image;
  require("fs").writeFile(
    `u2net/images/${image_name}`,
    base64Data,
    "base64",
    function (err) {
      console.log(err);
    },
  );
  next();
};

router.get("/", (req, res) => {
  res.send("Hello again");
});

router.post("/image-segment", base64ToImage, (req, res, next) => {
  const image = req.body.image;

  if (!image) {
    return res.status(400).send({ message: "Please upload an image." });
  }

  const { spawn } = require("child_process");

  const segmentation = spawn("python", ["segment.py"]);

  segmentation.on("close", (code) => {
    // res.write(image_name.replace("jpg", "png"));
    console.log("File name sent");
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

      // fse.emptyDir(output_folder, (err) => {
      //   if (err) return console.error(err);
      // });

      // fse.readdir(output_folder, (err, files) => {
      //   if (err) {
      //     console.log(err);
      //   }

      //   files.forEach((f) => {
      //     const fileDir = path.join(output_folder, f);
      //     const image_file = file.filename.slice(0, -3) + "png";

      //     if (f !== image_file) {
      //       fse.unlinkSync(fileDir);
      //     }
      //   });
      //   console.log("Output folder cleaned");
      // });
    });
  });
});

router.post("/vari", vari_upload.single("dataFiles"), (req, res, next) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send({ message: "Please upload a file." });
  }

  const { spawn } = require("child_process");
  console.log("Spawning child process...");
  const python = spawn("python", ["vari.py", file.filename]);

  python.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  python.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  python.on("close", (code) => {
    res.send(file);
    console.log("File name sent");
    console.log(`child process close all stdio with code ${code}`);

    const images_folder = process.cwd() + "/vari/input";
    const output_folder = process.cwd() + "/output";

    fse.emptyDir(images_folder, (err) => {
      if (err) return console.error(err);
      console.log("Input folder cleaned!");
    });

    fse.readdir(output_folder, (err, files) => {
      if (err) {
        console.log(err);
      }

      files.forEach((f) => {
        const fileDir = path.join(output_folder, f);
        const image_file = file.filename.slice(0, -3) + "png";

        if (f !== image_file) {
          fse.unlinkSync(fileDir);
        }
      });
      console.log("Output folder cleaned");
    });
  });
});

module.exports = router;
