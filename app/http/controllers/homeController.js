const Products = require('../../models/product')
function homeController() {
    return {
        async index(req, res) {
            const products = await Products.find()
            return res.render('home', {  products })
        }
    }
}

module.exports = homeController