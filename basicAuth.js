function authUser(req, res, next) {
    if (req.session.userId == null) {
        res.status(403)
        return res.send('You need to sign in')
    }
    next()
}

function authRole(role) {
    return (req, res, next) => {
        if(req.session.role !== role) {
            res.status(401)
            return res.send('Not allowed - ' + req.session.role)
        }
        next()
    }
}

module.exports = {authUser, authRole}