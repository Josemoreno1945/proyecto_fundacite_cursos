
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import usuarios_routes from './routes/usuarios.routes.js'
import roles_routes from './routes/roles.routes.js'
import profesiones_routes from './routes/profesiones.routes.js'
import estados_routes from './routes/estados.routes.js'
import municipios_routes from './routes/municipios.routes.js'
import parroquias_routes from './routes/parroquias.routes.js'
import instituciones_routes from './routes/instituciones.routes.js'
import talleres_routes from './routes/talleres.routes.js'
import menores_routes from './routes/menores.routes.js'


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
app.use('/api',roles_routes);
app.use('/api',profesiones_routes);
app.use('/api',estados_routes);
app.use('/api',municipios_routes);
app.use('/api',parroquias_routes);
app.use('/api',instituciones_routes);
app.use('/api',talleres_routes);
app.use('/api',menores_routes);



app.use((err, req, res, next) => {
    const status = err.status || 500;
    const mensaje = err.status ? err.message : 'Error interno del servidor';

    if (!err.status) {
        console.error('Error no controlado del servidor:', err);
    }

    res.status(status).json({
        error: mensaje
    });
});

export default app;
