// Define a function to get environment variables at runtime
const getEnvironmentVariables = () => {
  const frontendPort = process.env.frontendPort ? Number(process.env.frontendPort) : 4201;
  const websocketPort = process.env.websocketPort ? Number(process.env.websocketPort) : 3334;

  const openaiApiKey = process.env.FNF_OPENAI_API_KEY || '';
  const openaiApiUrl = process.env.FNF_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const openaiModel = process.env.FNF_OPENAI_MODEL || 'gpt-4';

  const llamaApiKey = process.env.FNF_LLAMA_API_KEY || '';
  const llamaApiUrl = process.env.FNF_LLAMA_API_URL || 'http://localhost:11434/api/generate';
  const llamaModel = process.env.FNF_LLAMA_MODEL || 'llama3';

  const aiCompletionService = process.env.FNF_AI_COMPLETION_SERVICE || 'openai';

  return {
    frontendPort,
    websocketPort,
    openaiApiKey,
    openaiApiUrl,
    openaiModel,
    llamaApiKey,
    llamaApiUrl,
    llamaModel,
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
  get openaiApiUrl() {
    return getEnvironmentVariables().openaiApiUrl;
  },
  get openaiModel() {
    return getEnvironmentVariables().openaiModel;
  },
  get llamaApiUrl() {
    return getEnvironmentVariables().llamaApiUrl;
  },
  get llamaModel() {
    return getEnvironmentVariables().llamaModel;
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
