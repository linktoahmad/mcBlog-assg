const handleError = (error, context = 'General') => {
  //replace with sentry or other logging service
  console.error(`[${new Date().toISOString()}] [${context}]`, error);
};

export { handleError };
