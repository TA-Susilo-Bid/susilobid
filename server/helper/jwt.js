const jwt = require('jsonwebtoken');

module.exports = {
    createJWTToken : payload => {
        return jwt.sign(payload, 'kuncirahasia', {
            expiresIn : '12h'
        });
    },
    auth : (req, res, next) => {
        if (req.method !== 'OPTIONS') {
            jwt.verify(req.token, 'kuncirahasia', (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        message : err
                    });
                }
                // console.log(decoded, 'hasil decrypt');
                req.user = decoded;
                next();
            });
        } else {
            next();
        };
    }
};