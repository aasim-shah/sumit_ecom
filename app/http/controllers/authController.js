const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const axios = require("axios")
function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    
    return {
        login(req, res) {
            res.render('auth/login')
        },
        get_otp(req, res) {
            res.render('auth/getotp' , {user : null})
        },
     async post_otp(req, res) {
                let reg_phone = req.body.phone;
                var otp = generateOTP();
                axios({
                  url: "https://www.fast2sms.com/dev/bulkV2",
                  method: "post",
                  headers: {
                    authorization:
                      "UwizLrB0fQhFpNVtYdy8xH4oMmlbGDv91qakTIg25ZSsPWKCu6NaFrqQZl0WGMLHzPIRnctfDxvs5uk6"
                  },
                  data: {
                    variables_values: otp,
                    route: "otp",
                    numbers: reg_phone
                  }
                })
                  .then(ee => {
                    console.log(ee.data);
                  })
                  .catch(err => {
                    console.log(err);
                  });
                console.log(otp);
                let save_otp = await User.findOneAndUpdate(
                  { phone: reg_phone },
                  {
                    otp: otp
                  }
                );
                if (save_otp) {
                  res.render("auth/verifyotp");
                } else {
                  res.send("filed to save otp");
                }              
        },
       async verify_otp (req, res) {
            let otp = req.body.otp;
            console.log(otp);
            let verified = await User.findOne({ otp: otp });
            if (verified) {
              let verify = await User.findOneAndUpdate(
                { otp: otp },
                { otp_verified : true }
              );
              res.redirect("/login");
            } else {
              res.redirect("/register");
            }
          },
        postLogin(req, res, next) {
            const { phone, password }   = req.body
           // Validate request 
            if(!phone || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
         const { name, email, phone,  password }   = req.body
         // Validate request 
         if(!name || !email || !password || !phone) {
             req.flash('error', 'All fields are required')
             req.flash('name', name)
             req.flash('email', email)
             req.flash('phone', phone)
            return res.redirect('/register')
         }

         // Check if email exists 
         User.exists({ phone : phone }, (err, result) => {
             if(result) {
                req.flash('error', 'Email already taken')
                req.flash('name', name)
                req.flash('phone', phone) 
                req.flash('email', email) 
                return res.redirect('/register')
             }
         })

         // Hash password 
         const hashedPassword = await bcrypt.hash(password, 10)
         // Create a user 
         const user = new User({
             name,
             email,
             phone,
             password: hashedPassword
         })

         user.save().then((user) => {
            // Login
            return res.render('auth/getotp' , {user})
         }).catch(err => {
            req.flash('error', 'Something went wrong')
                return res.redirect('/register')
         })
        },
        logout(req, res) {
          req.logout()
          return res.redirect('/login')  
        }
    }
}

function generateOTP() {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
module.exports = authController