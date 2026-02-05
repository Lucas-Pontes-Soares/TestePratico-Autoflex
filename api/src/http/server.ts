import 'dotenv/config';
import express from 'express';
import router from './routes.ts'; 

import cors from 'cors'; 
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*',
}

app.use(express.json());

app.use(cors(corsOptions));

app.use(router);

app.listen(PORT, () => {
  console.log(`[Autoflex] Server is running at http://localhost:${PORT}`);
});