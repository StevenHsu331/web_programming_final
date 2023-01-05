import express from 'express';
import cors from 'cors';
import dotenv from "dotenv-defaults";
import routes from './routes/index.js'
import http from "http";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const buildPath = path.join(__dirname, '..', 'build');
dotenv.config();
const app = express();
app.use(express.json())
app.use(cors());
app.use(routes);
app.use(express.static(buildPath));

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})