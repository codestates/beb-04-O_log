const checkLoggedIn = (req, res, next) => {
  if (!res.locals.user) {
    res.status(401).send("unauthorized");
    return;
  }
  return next();
};

module.exports = checkLoggedIn;
