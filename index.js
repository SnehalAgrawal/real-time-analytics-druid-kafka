const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sendClick = require("./producer");
const queryDruid = require("./query");

const app = express();
app.use(bodyParser.json());
app.use(express.static("views"));

app.post("/click", async (req, res) => {
  const { userId, page } = req.body;
  const timestamp = new Date().toISOString();
  await sendClick({ userId, page, timestamp });
  res.send({ status: "ok" });
});

app.get("/stats", async (req, res) => {
  const stats = await queryDruid();
  res.json(stats);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
