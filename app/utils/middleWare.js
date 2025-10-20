module.exports = (app) => {

    this.isAuthenticated = (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('You are not authenticated')
        } else {
            return next()
        }
    }

    return this;
}