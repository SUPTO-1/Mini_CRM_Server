import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const { signup, login} = require("./Authentication");
const {AuthenticationToken} = require("./AuthenticationToken");
const {addClient,getClients,listClients,deleteClient, updateClient, getSingleClient} = require("./Clients");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", signup);
app.post("/login", login);

// client information
app.post("/clients", AuthenticationToken, addClient);
app.get("/clients/counts", AuthenticationToken, getClients);
app.get("/clients", AuthenticationToken, listClients);
app.delete('/clients/:id', AuthenticationToken, deleteClient);
app.get('/clients/:id',AuthenticationToken, getSingleClient);
app.put('/clients/:id',AuthenticationToken, updateClient);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});