import express from "express";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import errorHandler from "./middleware/error.js";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
// import { createServer } from "http";
// import { Server } from "socket.io";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//SOCKET IO
// const server = createServer(app).listen(PORT, (
//   cors:{
//     origin: ["https://localhost:3000"]
//   },
//   ) => {
//     console.log(`Server online on PORT ${PORT}`)
//   });
//   const io = new Server(server, { allowEIO3: true });

//   io.on("connection", (socket) => {
//     console.log("a user connected");
//     console.log(socket.id);
//     socket.on("disconnect", () => {
//       console.log("user disconnected");
//     });
//   });
// ERRORHANDLER ALWAYS LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () =>
  console.log(`Server online on PORT ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});

app.use("/products", productRoutes);

app.use("/api/orders", ordersRoutes);

app.use("/api/auth", authRoutes);

app.use("/users", usersRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

console.table(listEndpoints(app));
