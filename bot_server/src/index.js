import express from 'express';
import cors from 'cors';
import { HiteshBotController, PiyushBotController } from '../Controllers/botController.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.post('/chat/hitesh' , HiteshBotController);
app.post('/chat/piyush' , PiyushBotController);

app.listen(3000 , () => {
    console.log("Server is running at 3000");
})