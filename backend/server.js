const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});



app.use("/api/auth", require("./routes/auth"));
app.use("/api/simulate", require("./routes/simulate"));
app.use("/api/transactions", require("./routes/transaction"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
