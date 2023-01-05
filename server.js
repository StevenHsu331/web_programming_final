import express from 'express';
import cors from 'cors';
import dotenv from "dotenv-defaults";
import routes from './backend/routes/index.js'
import http from "http";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();
const app = express();
app.use(express.json())
app.use(cors());
app.use(routes);
app.use(express.static(path.join(__dirname, "public")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const httpServer = http.createServer(app);

const port = process.env.PORT || 4000;
httpServer.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})