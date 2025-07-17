// Define a function to get environment variables at runtime
const getEnvironmentVariables = () => {
  const frontendPort = process.env.frontendPort ? Number(process.env.frontendPort) : 4201;
  const websocketPort = process.env.websocketPort ? Number(process.env.websocketPort) : 3334;
  const openaiApiKey = process.env.FNF_OPENAI_API_KEY || '';
  const llamaApiKey = process.env.FNF_LLAMA_API_KEY || '';
  const aiCompletionService = process.env.FNF_AI_COMPLETION_SERVICE || 'openai';

  return {
    frontendPort,
    websocketPort,
    openaiApiKey,
    llamaApiKey,
    aiCompletionService
  };
};

// Create a dynamic environment object that gets values at runtime
export const environment = {
  production: false,

  get frontendPort() {
    return getEnvironmentVariables().frontendPort;
  },
  get websocketPort() {
    return getEnvironmentVariables().websocketPort;
  },
  get openaiApiKey() {
    return getEnvironmentVariables().openaiApiKey;
  },
  get llamaApiKey() {
    return getEnvironmentVariables().llamaApiKey;
  },
  get aiCompletionService() {
    return getEnvironmentVariables().aiCompletionService;
  },
  get websocketOptions() {
    const {frontendPort, websocketPort} = getEnvironmentVariables();
    return {
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
    };
  }
};
