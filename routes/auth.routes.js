const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const {isLoggedOut, isLoggedIn} = require('../middleware/route-guard')

const recipesRouter = require("./recipes.routes");
//app.use("/recipes", recipesRouter);


//SIGNUP

router.get('/signup', isLoggedOut, (req, res) => {
  const loggedInNavigation = false
  res.render('auth/signup', {loggedInNavigation});
});


router.post('/signup', isLoggedOut, (req, res) => {
  const { email, password, username } = req.body;

  //server-side validation
  if (!email || !password || !username) {
    res.render('auth/signup', { errorMessage: 'Please provide at least your email, full name and password.'});
    return;
  }

  bcryptjs
  .genSalt(saltRounds)
  .then((salt) => bcryptjs.hash(password, salt))
  .then((hashedPassword) => {
    //console.log(`Password hash: ${hashedPassword}`);
    return User.create({
        email,
        username,
        password: hashedPassword
    });
  })
  .then((user) => {
    //console.log('Newly created user is: ', userFromDB);
    req.session.currentUser = user;
    //res.render('auth/profile', {user})
    res.redirect('../recipes/list');
    //res.redirect('/auth/login');
  })
  .catch((error) => console.log(error));
});

// router.get('/profile', isLoggedIn, (req, res) => {
//   const { username } = req.session.currentUser;
//   const loggedInNavigation = true;
//   res.render('auth/profile', { username, loggedInNavigation});
//   //res.render('auth/profile');
// });


//LOGIN

router.get('/login', isLoggedOut, (req, res) => {
  const loggedInNavigation = false;
    res.render('auth/login', {loggedInNavigation});
});

router.post('/login', isLoggedOut, (req, res) => {
    console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;
  
    if (!email || !password ) {
      res.render('auth/login', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
      return;
    }
  
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.render('auth/login', {
            errorMessage: 'Email is not registered. Try with other email.',
          });
          return;
        } else if (bcryptjs.compareSync(password, user.password)) {
          req.session.currentUser = user;
          console.log(user)

          res.redirect('../recipes/list');
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password.' });
        }
      })
      .catch((error) => console.log(error));
});

//LOGOUT
router.post('/logout', isLoggedIn, (req, res) => {
    res.clearCookie('connect.sid')
    req.session.destroy(() => res.redirect('/auth/login'))
})

module.exports = router;
