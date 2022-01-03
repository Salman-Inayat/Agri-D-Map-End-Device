import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@mui/material";
import useStyles from "./styles.js";
// import CameraAltIcon from "@mui/icons/CameraAlt";

const WebcamCapture = (props) => {
  const classes = useStyles();

  const [image, setImage] = useState("");
  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 300,
    height: 300,
    facingMode: "user",
  };

  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(
        mediaDevices.filter(
          ({ kind, label }) =>
            kind === "videoinput" &&
            label === "Logitech Webcam C930e (046d:0843)"
        )
      ),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    props.handleImage(imageSrc);
  });

  const retake = () => {
    setImage("");
    props.handleImagePresent(false);
  };

  return (
    <div className="webcam-container">
      <div className="webcam-img">
        {/* {image === "" ? (
          <Webcam
            audio={false}
            height={300}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={250}
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={image} alt="img" />
        )} */}
        {devices.map((device, key) =>
          image === "" ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={450}
              height={450}
              videoConstraints={{ deviceId: device.deviceId }}
            />
          ) : (
            <img src={image} alt="img" />
          )
        )}
      </div>
      <div>
        {image !== "" ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              retake();
            }}
            className={classes.webcamBtn}
            // startIcon={<CameraAltIcon />}
            style={{ backgroundColor: "#3f4257", borderRadius: "30px" }}
          >
            Retake Image
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className={classes.webcamBtn}
            style={{
              marginLeft: "30%",
              backgroundColor: "#3f4257",
              borderRadius: "30px",
            }}

            // startIcon={<CameraAltIcon />}
          >
            Capture
          </Button>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
