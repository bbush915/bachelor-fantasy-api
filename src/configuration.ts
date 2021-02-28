const configuration = {
  server: {
    port: process.env.APP_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

export default configuration;
