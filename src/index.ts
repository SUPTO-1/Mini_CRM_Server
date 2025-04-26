import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const { signup, login} = require("./Authentication");
const {AuthenticationToken} = require("./AuthenticationToken");
const {addClient} = require("./Clients");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", signup);
app.post("/login", login);
app.post("/clients", AuthenticationToken, addClient);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});