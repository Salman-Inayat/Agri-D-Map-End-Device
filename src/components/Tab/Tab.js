/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Tab, Tabs, Box, Grid, Typography } from "@mui/material";
import PropTypes from "prop-types";

// import Audio from "../../components/Audio_Player/Audio_Player";
import useStyles from "./styles.js";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      className={classes.tabPanel}
      style={{ padding: "50px" }}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ReaultTab(props) {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const { audio, data } = props;
  const [image, setImage] = useState();
  const [imageURL, setImageURL] = useState();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setImage(props.image);
    console.log(props.image);
    setImageURL(`http://localhost:3001/${props.image}`);
  }, []);

  useEffect(() => {
    setImage(props.image);
    console.log(props.image);
    setImageURL(`http://localhost:3001/${props.image}`);
  }, [props.image]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const reloadSrc = (e) => {
    if (fallback) {
      e.target.src = `http://localhost:3001/${props.image}`;
    } else {
      e.target.src = setImageURL(`http://localhost:3001/${props.image}`);
      setFallback(true);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="English" {...a11yProps(0)} />
          <Tab label="اُردُو" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container spacing={4}>
          <Grid item md={7} xs={12}>
            <Typography
              variant="h4"
              component="h2"
              style={{ fontWeight: "bold" }}
            >
              {data.title}
            </Typography>
            <Typography variant="body1" component="p">
              {data.description}
            </Typography>

            <Typography
              variant="h5"
              bold
              component="h2"
              style={{ fontWeight: "bold", marginTop: "20px" }}
            >
              Symptoms
            </Typography>
            <Typography variant="body1" component="p">
              {data.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </Typography>
          </Grid>

          <Grid item md={4} xs={12}>
            {/* <Audio audio={audio} /> */}
            <img
              src={imageURL}
              alt="result"
              className={classes.resultImage}
              key={Date.now()}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container spacing={4}>
          <Grid item md={7} xs={12}>
            <Typography
              variant="h4"
              component="h2"
              style={{ fontWeight: "bold" }}
            >
              {data.title}
            </Typography>
            <Typography variant="body1" component="p">
              {data.description}
            </Typography>

            <Typography
              variant="h5"
              component="h2"
              style={{ fontWeight: "bold", marginTop: "20px" }}
            >
              Symptoms
            </Typography>
            <Typography variant="body1" component="p">
              {data.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </Typography>
          </Grid>

          <Grid item md={5} xs={12}>
            {/* <Audio audio={audio} /> */}
            <img
              src={`${image}`}
              alt="result"
              className={classes.resultImage}
              onError={reloadSrc}
            />
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
}
