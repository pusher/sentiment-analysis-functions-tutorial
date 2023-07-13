import express from "express";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import Pusher from "pusher";
import { dummyUsers, parseCookies } from "../frontend/utils.js";

config();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

const app = express();
const port = process.env.PORT || 4040;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const cookies = parseCookies(req);
  const username = cookies.username;

  const user = dummyUsers.find((user) => user.user_info.name === username);
  if (!user) return res.status(403).send("Invalid username");

  const authResponse = pusher.authorizeChannel(socketId, channel, user);

  res.json({
    ...authResponse,
    channel_data: JSON.stringify(user),
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend/admin.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
