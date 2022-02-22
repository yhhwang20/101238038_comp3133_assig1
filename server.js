const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
//import typedefs and resolvers
const TypeDefs = require('./schema');
const Resolvers = require('./resolvers');
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');
//Store sensitive information to env variables
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, process.env.SUPER_SECRET )
        }
        return null;
    } catch (err){
        return null;
    }
}

//mongoDB Atlas Connection String
const mongodb_atlas_url = process.env.MONGODB_URL;
//MongoDB
mongoose.connect(mongodb_atlas_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("MongoDB connected successfully");
}).catch(err => {
    console.log("Error to connect MongoDB");
});

//Define Apollo Server
const server = new ApolloServer({
    typeDefs: TypeDefs.typeDefs,
    resolvers: Resolvers.resolvers,
    context: ({ req }) => {
        const tokenWithBearer = req.headers.authorization || '';
        const token = tokenWithBearer.split(' ')[1];
        const user = getUser(token);
        return { user, req };
    }
});

//Define Express Server
const app = express();
app.use(bodyParser.json());
app.use('*', cors());

//Add Express app as Middleware to Apollo Server
server.applyMiddleware({app});
//Add the JWT middleware


app.listen({ port: process.env.PORT}, () =>
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`));