const express = require("express");
const axios = require("axios").default;
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const config = {
      headers: {
        Authorization:
          "Bearer _lT4eE8rZnG3PsCV8N9QsQ24StjFk8_VfIL7asd9E4ANY05Hfa4KrGbB1wOaISd4Zde_Yjbxpw_gy3ca36mogr8xECy8OAcwRv1Km8vbZIe7sFGNQUO2IcJToTVdYnYx",
      },
      params: {
        term: "restaurants",
        location: "toronto",
        sort_by: "rating",
        limit: 10,
      },
    };

    const response = await axios.get(
      "https://api.yelp.com/v3/businesses/search",
      config
    );
    // setTopRestaurants(response.data.businesses);
    res.send(response.data.businesses);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
