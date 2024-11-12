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
    
}