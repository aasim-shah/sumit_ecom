const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const productController = require('../app/http/controllers/customers/productController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')
const multer = require('multer')
const Razorpay = require('razorpay')



const instance = new Razorpay({
    key_id : "rzp_test_IqpKKCt3Rb3DJQ",
    key_secret : "o2STvxx3SZNKDUkVd5O0Dh8z"
  })


// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,  uniqueSuffix + "_" + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
const verified = require('../app/http/middlewares/otp_verified')

function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login',verified ,authController().postLogin)
    app.get('/otp', authController().get_otp)
    app.post('/getotp', authController().post_otp)
    app.post('/verify_otp', authController().verify_otp)

    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)
    app.get('/view_product/:id'  , productController().single)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    // Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)



   app.post('/checkout' , async (req , res)=> {
      instance.orders.create({
        amount: 5 * 100,
        currency: "INR",
        receipt: "receipt#1",
      } , function(err ,order){
        if(err){
          console.log(err)
    
        }else{
          console.log(order)
          res.render('customers/cart' ,{d : req.session.cart , id : order.id})
        }
      })
    })
  
    // Admin routes
    app.get('/admin/orders', admin, adminOrderController().index)
    app.get('/admin/orders/create', admin, adminOrderController().create)
    app.post('/admin/orders/create', admin, upload.single('image'), adminOrderController().create_post)
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes

