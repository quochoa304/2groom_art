const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

const homeRoutes = require("./routes/homeRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const notionRoutes = require("./routes/galleryRoutes");
const packageRoutes = require("./routes/packageRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/", homeRoutes);
app.use("/about-me", aboutRoutes);
app.use("/gallery", notionRoutes);
app.use("/api", notionRoutes);
app.use("/packages", packageRoutes);
app.use("/contact", contactRoutes);
// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
