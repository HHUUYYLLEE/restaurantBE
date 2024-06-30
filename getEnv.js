const axios = require("axios");
axios
  .get("https://restaurantbe-huyle-2a11ba84.koyeb.app/api/utils")
  .then((res) => {
    console.log(res.data.data);
  });
