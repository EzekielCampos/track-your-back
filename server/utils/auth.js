const jwt = require("jsonwebtoken");
const secret = 'test';
const expiration = '1h';
const {GraphQLError} = require("graphql");

module.exports ={
    AuthenticationError: new GraphQLError("Could not authenticate user",{
        extensions:{
            code:'UNAUTHENTICATED',
        }
    }),

    authMiddleware: function ({req}){
        let token = req.cookies.token;
        if(!token){
            token = req.body.token || req.query.token ||req.headers.authorization?.split(" ")[1];
        }

        if(!token){
            return req
        }

        try {
            const {data} = jwt.verify(token, secret, {maxAge:expiration});

            req.user = data
            
        } catch (error) {
            console.log("invalid token");
        }

        return req
    }

}