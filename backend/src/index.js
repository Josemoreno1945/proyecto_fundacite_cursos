import 'dotenv/config';
import app from './app.js';
import { pool } from './db.js';

const PORT = process.env.PORT || 3000;

pool.query('SELECT NOW()')
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch((err) => console.error('Error conectando a la base de datos:', err.message));

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});