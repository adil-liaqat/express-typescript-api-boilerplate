import http from 'http';
import { Error } from 'sequelize/types';
import app from './server'

const server: http.Server = http.createServer(app);

server.listen(process.env.PORT).on('error', console.error);

server.on('listening', () => {
  console.log(
    `Server started on port ${process.env.PORT} on ENV ${process.env.NODE_ENV || 'dev'}`
  )
})

process.on('uncaughtException', (err: Error) => {
  console.error(err.stack);
  console.log('Node NOT Exiting...');
});
