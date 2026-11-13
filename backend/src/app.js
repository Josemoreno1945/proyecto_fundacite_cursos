
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import usuarios_routes from './routes/usuarios.routes.js'


const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente'
    });
});

app.use('/api',usuarios_routes);


app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'Error interno del servidor'
    });
});

export default app;
