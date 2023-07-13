import express from "express";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

config();

const app = express();
const port = process.env.PORT || 4040;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend/admin.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
