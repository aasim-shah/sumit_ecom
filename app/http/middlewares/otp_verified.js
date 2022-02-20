const User = require('../../models/user')
async function verified (req, res, next) {
        let userr = await User.findOne({ phone: req.body.phone });
        console.log("userrr");
      if(userr){
          let verified = userr.otp_verified;
        if (verified) {
          return next();
        } else {
          res.render("auth/getotp", { user: userr });
        }
      }else{
        res.redirect('/login')
      }
    }

module.exports = verified
