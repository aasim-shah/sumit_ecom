function address_updated (req, res, next) {
    if(req.isAuthenticated() && req.user.address) {
        return next()
    }
    return res.redirect('/address')
}

module.exports = address_updated