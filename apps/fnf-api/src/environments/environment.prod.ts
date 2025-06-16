const frontendPort = process.env.frontendPort ? Number(process.env.frontendPort) : 4201;
const websocketPort = process.env.websocketPort ? Number(process.env.websocketPort) : 3334;

export const environment = {
  production: true,

  frontendPort,

  websocketPort: websocketPort,
  websocketOptions: {
    cors: {
      origin: [
        '*',
        'http://localhost:4200',
        'http://localhost:3333',
        'http://localhost:' + process.env.PORT,
        'http://localhost:' + frontendPort,
        'http://localhost:' + websocketPort,
      ],
      methods: ["GET", "POST"],
    }
  }
};
