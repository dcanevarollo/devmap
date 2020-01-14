module.exports = function getLocation(latitude, longitude) {
  if (latitude === '' || longitude === '') {
    return undefined;
  }

  return location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
};
