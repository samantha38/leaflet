const emissionFactor = 0.21;

exports.calculateEmissions = (distanceKm) => {
  return distanceKm * emissionFactor;
}