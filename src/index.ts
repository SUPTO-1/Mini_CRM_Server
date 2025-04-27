import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const { signup, login} = require("./Authentication");
const {AuthenticationToken} = require("./AuthenticationToken");
const {addClient,getClients,listClients,deleteClient, updateClient, getSingleClient} = require("./Clients");
const {addProject, getProjectsCount, listProjects, deleteProject, updateProject} = require("./Projects");
const { addInteraction, getInteractions, deleteInteraction, getInteractionsCount } = require("./Interactions");
const { addReminder, getWeeklyReminders } = require("./Reminders");
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

//Projects information

app.post("/projects", AuthenticationToken, addProject);
app.get("/projects/count", AuthenticationToken, getProjectsCount);
app.get("/projects", AuthenticationToken, listProjects);
app.delete('/projects/:id', AuthenticationToken, deleteProject);
app.put("/projects/:id", AuthenticationToken, updateProject)

//Interactions
app.post("/interactions", AuthenticationToken, addInteraction);
app.get("/interactions", AuthenticationToken, getInteractions);
app.delete('/interactions/:id', AuthenticationToken, deleteInteraction);
app.get("/interactions/count", AuthenticationToken, getInteractionsCount);


//Reminders
app.post("/reminders", AuthenticationToken, addReminder);
app.get("/reminders/weekly", AuthenticationToken, getWeeklyReminders);


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});