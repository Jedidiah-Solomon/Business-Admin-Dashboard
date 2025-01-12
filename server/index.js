import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Rate Limiter
import { rateLimiter } from "./middlewares/rateLimiter.js";

//Mongoose - MongoDb
import connectToMongoDB from "./db/connectToMongoDB.js";

// Routes imports
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

// Import the insertData function
import { insertData } from "./services/db.services.js";

// Configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(rateLimiter);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Home Page!");
});

// Routes Setup
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

const PORT = process.env.PORT || 9000;

connectToMongoDB()
  .then(() => {
    insertData()
      .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
      })
      .catch((error) => {
        console.log("Error during data insertion: ", error);
      });
  })
  .catch((error) => console.log(`${error} did not connect.`));
