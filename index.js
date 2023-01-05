import express from 'express';
import cors from 'cors';
import dotenv from "dotenv-defaults";
import routes from './backend/src/routes/index.js'

dotenv.config();
const app = express();
app.use(express.json())
app.use(cors());
app.use(routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})