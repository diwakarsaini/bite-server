const express = require("express");
const axios = require("axios").default;
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const config = {
      headers: {
        Authorization:
          "Bearer Tvh58J-u_HLHzoJyB3B_amiAm6WQyC7AhYoTSDBerhb7pSDvSq-X2ZuPrn0WagikTy6TuSQ11lsw76EOqRhDRY6c8uzqq4vQGOVvDY5fLfodhLrT-ZIp1syty0ldYnYx",
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
