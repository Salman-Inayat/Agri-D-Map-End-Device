import React, { useState } from "react";
import ImagePicker from "./components/Image_Picker/Image_Picker";
import useStyles from "./styles";
import WebcamCapture from "./components/Webcam/Webcam.js";
import { Button, Grid } from "@mui/material";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay";
import ResultTab from "./components/Tab/Tab";

import { api } from "./api";

function App() {
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [resultImage, setResultImage] = useState();
  const [loading, setLoading] = useState(false);
  const [imagePresent, setImagePresent] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [resultAudio, setResultAudio] = useState();

  const [tabData, setTabData] = useState();

  const remedialActions = {
    healthy: {
      title: "Healthy: Healthy Plant",
      description:
        "Fertilize the crop with the right fertilizer mixture and a balanced nutrient supply. Do not over-water the crop during the season. Do not touch healthy plants after touching infected plants. Maintain a high number of different varieties of plants around fields. If treating against an infestation, use specific products that do not affect beneficial insects. Remove diseased leaves, fruit or branches at the right time during the growing season. After the harvest, clean up plant debris from the field or orchard and burn them. In case of pests and diseases, always consider an integrated approach. with preventive measures together with biological treatments if available. As long as preventive measures are followed and care is taken to give plants and trees what they need, no chemical control should be needed!",
      symptoms: [
        "Dark green colored plant",
        "Firm leaves",
        "Brightly colored flowers",
        "Well shaped, good-colored leaves, nutritious fruits and flowers",
        "Root system is well developed",
      ],
    },
    resistant: {
      title: "Resistant: Mild Yellow Stripe Rust",
      description:
        "The severity of the disease depends on the susceptibility of the plant. In vulnerable varieties, the fungus produces tiny, yellow to orange (rusty) pustules that are arranged in rows forming narrow stripes parallel to the leaf veins. They eventually merge and can engulf the whole leaf, a feature that appears earlier in young plants. These pustules (0.5 to 1 mm in diameter) can sometimes also be found on stems and heads. At later stages of the disease, long, necrotic, light brown stripes or blotches are visible on leaves, often covered with rusty pustules. In severe infections, the growth of plants is seriously compromised and tissues are damaged. The reduced leaf area leads to lower productivity, fewer spikes per plant and fewer grains per spike. Overall, the disease can lead to severe crop losses.",
      symptoms: [
        "Yellow colored plant",
        "Tiny, rusty pustules arranged in stripes",
        "Stems and heads can alse be affected",
      ],
    },
    susceptible: {
      title: "Susceptible: Severe Yellow Stripe Rust",
      description:
        "The severity of the disease depends on the susceptibility of the plant. In vulnerable varieties, the fungus produces tiny, yellow to orange (rusty) pustules that are arranged in rows forming narrow stripes parallel to the leaf veins. They eventually merge and can engulf the whole leaf, a feature that appears earlier in young plants. These pustules (0.5 to 1 mm in diameter) can sometimes also be found on stems and heads. At later stages of the disease, long, necrotic, light brown stripes or blotches are visible on leaves, often covered with rusty pustules. In severe infections, the growth of plants is seriously compromised and tissues are damaged. The reduced leaf area leads to lower productivity, fewer spikes per plant and fewer grains per spike. Overall, the disease can lead to severe crop losses.",
      symptoms: [
        "Yellow colored plant with severe rust spots",
        "Tiny, rusty pustules arranged in stripes",
        "Stems and heads can alse be affected",
      ],
    },
  };

  const handleImage = (result) => {
    const slug = result.split("base64,").pop();
    setImage(slug);
    setImagePresent(true);
  };

  const handleImagePresent = (result) => {
    setImagePresent(result);
  };

  const handleSubmit = () => {
    setResult();
    setResultImage();
    setIsResult(false);

    if (imagePresent) {
      setLoading(true);
      axios
        .post(
          "http://localhost:43321/image-segment",
          {
            image: image,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          const response = res.data;
          var responseArray = response.split(/(\s+)/);
          setResult(responseArray[2]);
          setResultImage(responseArray[0]);

          switch (responseArray[2]) {
            case "Healthy":
              setResultAudio("/healthy_english.mp3");
              setTabData(remedialActions.healthy);
              break;
            case "Resistant":
              setResultAudio("/resistant_english.mp3");
              setTabData(remedialActions.resistant);
              break;
            case "Susceptible":
              setResultAudio("/susceptible_english.mp3");
              setTabData(remedialActions.susceptible);
              break;
            default:
              setResultAudio("/healthy_english.mp3");
              setTabData(remedialActions.healthy);
              break;
          }
          setLoading(false);
          setIsResult(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div>
      <LoadingOverlay active={loading} spinner text="Processing the image">
        <Grid container spacing={2} className={classes.div_container}>
          <Grid
            item
            md={5}
            sm={5}
            className={classes.ind_div}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ImagePicker
              handleImage={handleImage}
              handleImagePresent={handleImagePresent}
            />
          </Grid>
          <Grid
            item
            md={1}
            sm={1}
            className={classes.ind_div}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3>OR</h3>
          </Grid>
          <Grid
            item
            md={5}
            sm={6}
            className={classes.ind_div}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <WebcamCapture
              handleImage={handleImage}
              handleImagePresent={handleImagePresent}
            />
          </Grid>

          <Grid
            item
            md={12}
            sm={12}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              disabled={imagePresent ? false : true}
              color="primary"
              size="large"
              className={classes.submitButton}
              onClick={handleSubmit}
              style={{
                backgroundColor: "#3f4257",
                borderRadius: "30px",
                color: "white",
              }}
            >
              Submit
            </Button>
          </Grid>
          {isResult && tabData && resultImage === "image.png" && (
            <Grid item md={12} sm={12}>
              <div className={classes.result_container}>
                <ResultTab
                  audio={resultAudio}
                  result={result}
                  image={resultImage}
                  data={tabData}
                />
              </div>
            </Grid>
          )}
        </Grid>
      </LoadingOverlay>
    </div>
  );
}

export default App;
