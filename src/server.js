import express from 'express';
import handlebars from 'express-handlebars';
import {
      Server
} from 'socket.io';
import cookieParser from 'cookie-parser';
import CONFIG from './config/environment/config.js';
import __dirname from './__dirname.js';
import {
      MongoManager
} from './models/manager/mongo/mongo.manager.js';
import cors from 'cors';

import router from './routes/app.routes.js';

const app = express();
const PORT = CONFIG.PORT;

MongoManager.start();

const httpServer = app.listen(PORT, () => {
      console.log(`Server corriendo en el puerto: ${PORT}`);
});

export const io = new Server(httpServer);

const allowedOrigins = ["http://localhost:3000","http://localhost:3000/","http://localhost:5173","http://localhost:5173/","https://bunker-phoneshop.pages.dev/", "https://bunker-phoneshop.pages.dev"];

app.use(cors({
      origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                  const msg = 'The CORS policy for this site does not ' +
                        'allow access from the specified Origin.';
                  return callback(new Error(msg), false);
            }
            return callback(null, true);
      },
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
      extended: true
}));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', router);