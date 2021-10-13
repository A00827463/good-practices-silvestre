const jwt = require('jsonwebtoken');
const { secret } = require('../../config');

// Middleware function to require a login
function requireLogin(req, res, next) {

    // if there is no token stored in cookies, the request is unauthorized
    if (!req.headers.authorization) {
        console.log('Unauthorized access');
        return res.status(403).send({ message: "Unauthorized access" });
    }

    try {
        // use the jwt.verify method to verify the access token, it throws an error if the token has expired or has a invalid signature
        // Format is: Authorization: Bearer <token>, so in "Bearer <token>" after the first space we get the token
        const accessToken = req.headers.authorization.split(" ")[1];
        console.log(`token is: ${accessToken}`)
        payload = jwt.verify(accessToken, secret)
        console.log('Logged user accessing the site ' + payload.name);
        req.user = payload; 
        next()
    }
    catch (e) {
        // Maybe it expired, or something else even though the token is valid
        console.error(`error: ${e.message}`)
        return res.status(403).json("Unauthorized access")
    }
}

function generateToken(user) {
    let payload = {
        name: user.name,
        id: user._id,
        email: user.email
    };
    let oneDay = 60 * 60 * 24;
    return token = jwt.sign(payload, secret, { expiresIn: oneDay });
}

module.exports = { requireLogin, generateToken }