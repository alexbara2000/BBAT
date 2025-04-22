const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

const database = require("./db");
const findingsRouter = require("./findings");

const SERVER_PORT = parseInt(process.env.COOKIE_EXPORT_PORT || "3000", 10);

// Initialize core components
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Attach socket.io instance to the app for global access
app.set("socketio", io);

// Middleware setup for JSON and URL-encoded payloads
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "100mb",
  parameterLimit: 50000
}));

// Routing
app.use("/", findingsRouter);

// Database connection and server start logic
database.connectToDatabase((error, dbInstance) => {
  if (error) {
    console.error("Database connection failed:", error);
    return;
  }

  // Setup socket.io events
  io.on("connection", socket => {
    console.log("A client connected.");

    socket.on("disconnect", () => {
      console.log("Client disconnected.");
    });
  });

  // Start HTTP server
  server.listen(SERVER_PORT, () => {
    console.log("---------------------------------------------------------------");
    console.log(`Export Server is live at http://127.0.0.1:${SERVER_PORT}`);
    console.log("---------------------------------------------------------------");
  });
});
