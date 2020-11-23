module.exports = (number) => {
  const re = /^[-+]?[0-9]*\.?[0-9]+$/;

  return re.test(number);
};