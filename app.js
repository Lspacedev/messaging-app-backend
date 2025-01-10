const express = require("express");
const app = express();
const path = require("node:path");
const passport = require("passport");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
//define routers
const indexRouter = require("./routes/indexRouter");
const usersRouter = require("./routes/usersRouter");

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.use((req, res, next) => {
  req.io = io;
  return next();
});

// io.on('connection', (socket) => {
//     console.log('A user is connected');

//     socket.on('message', (message) => {
//       console.log(`message from ${socket.id} : ${message}`);
//     })

//     socket.on('disconnect', () => {
//       console.log(`socket ${socket.id} disconnected`);
//     })
//   })

require("dotenv").config();

const jwt = require("jsonwebtoken");

//passport stuff
const jwtStrategry = require("./strategies/jwt");
passport.use(jwtStrategry);

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//index routes
app.use("/", indexRouter);

//users route
app.use("/users", usersRouter);

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Express app listening on port ${PORT}!`)
);
