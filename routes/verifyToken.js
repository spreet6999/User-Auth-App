const JWT = require('jsonwebtoken');

function auth (req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try{
        const verified = JWT.verify(token, process.env.TOKEN_SECRET); //it will send us _id and _iat of the user if verification completes.
        req.user = verified;
        next();
    }
    catch(err){
        res.status(400).send('Invalid Token');
    }
}

module.exports = auth;