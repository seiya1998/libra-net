module.exports = {
  baseURL: process.env.VITE_APP_API_URL,
  input: 'src/apis/bin/openapi/',
  outputEachDir: true,
  openapi: { inputFile: '../server/docs/openapi-for-admin.yaml' }
};
