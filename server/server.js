const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cookieParser = require("cookie-parser");
const {authMiddleware} = require("./utils/auth")

const path = require("path");
const cors = require("cors");
const db = require("./config/connection");

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  context: ({ req, res }) => ({ req, res }),
});

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "http://localhost:3000"
      : "http://localhost:3000",
  credentials: true,
};

const startApolloServer = async () => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());

  app.use(cors(corsOptions));

  app.use("/graphql", expressMiddleware(server, {authMiddleware}));

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http:localhost:${PORT}/graphql`);
    });
  });
};
