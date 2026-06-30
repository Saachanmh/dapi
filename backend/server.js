import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pmrRoutes from './routes/pmrRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', pmrRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Dapi PMR - Backend fonctionnel !' });
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
