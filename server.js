const express = require("express");
const path = require("path");
const app = express();


app.use(express.static(path.join(__dirname, "dist/")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
