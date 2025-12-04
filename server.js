require("./db");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", require("./routes/auth"));

app.listen(3000, () => console.log("Server running at http://localhost:3000"));