require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schema");
const employeeResolvers = require("./employeeResolver");
const userResolvers = require("./userResolver");
console.log("MONGODB_URI:", process.env.MONGODB_URI);

async function startServer() {
    await mongoose.connect(process.env.MONGODB_URI);

    const server = new ApolloServer({
        typeDefs,
        resolvers: [employeeResolvers, userResolvers], // ✅ include both
    });

    await server.start();

    const app = express();
    const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200').split(',');
    app.use(cors({ origin: allowedOrigins, credentials: true }));
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer().catch((err) => {
    console.error(err);
    process.exit(1);
});
