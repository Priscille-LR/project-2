const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

const isOwner = (req, res, next) => {
  if(!req.session.currentUser._id === req.params.roomId){
   res.redirect('/')
  }
  next()
}


module.exports = {
  isLoggedIn,
  isLoggedOut,
  isOwner
};
