const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featuredEventSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  event_site_url: {
    type:String,
    require: true,
  },
  image_url: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('FeaturedEvent', featuredEventSchema);