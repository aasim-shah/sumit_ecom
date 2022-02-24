const Order = require('../../../models/order')
const Products = require('../../../models/product')

function orderController() {
    return {
        index(req, res) {
           Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
               if(req.xhr) {
                   return res.json(orders)
               } else {
                return res.render('admin/orders')
               }
           })
        },
       async create(req, res) {
         res.render('admin/add_product')
         },
       async create_post(req, res) {
      const d = new Products({
          name : req.body.name,
          desc : req.body.desc,
          size : req.body.size,
          price : req.body.price,
          bv : req.body.bv,
          image : req.file.filename 
      })
      const saved  = await d.save();
      res.redirect('back')
    }
    }
}

module.exports = orderController