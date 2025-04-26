import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const { signup, login} = require("./Authentication");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", signup);
app.post("/login", login);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});