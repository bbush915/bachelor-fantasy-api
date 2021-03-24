const configuration = {
  client: {
    host: process.env.CLIENT_HOST,
  },
  server: {
    port: process.env.SERVER_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  sendGrid: {
    apiUrl: process.env.SENDGRID_API_URL || "https://api.sendgrid.com/v3",
    apiKey: process.env.SENDGRID_API_KEY,
    sender: process.env.SENDGRID_SENDER,
  },
};

export default configuration;
