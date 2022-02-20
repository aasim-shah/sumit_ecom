const Products = require('../../../models/product')

function orderController () {
    return {
        async single(req , res){
            const id = req.params.id
            const product = await Products.findById(id)
            res.render('single_product' , {product})
        }
    }
}

module.exports = orderController