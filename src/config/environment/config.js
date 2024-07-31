import dotenv from 'dotenv';

dotenv.config({
      path: `../.env`
});

const CONFIG = {
      API_URL: process.env.API_URL,
      VIEWS_URL: process.env.VIEWS_URL,
      PORT: process.env.PORT,
      MONGO_URL: process.env.MONGO_URL,
      SECRET: process.env.SECRET,
      KEY: process.env.KEY,
      ADMIN: {
            first_name: process.env.ADMIN_FIRST_NAME,
            last_name: process.env.ADMIN_LAST_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: process.env.ADMIN_ROLE
      },
      GITHUB: {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            clientURL: process.env.GITHUB_CLIENT_URL
      },
      MAIL: {
            user: process.env.MAIL_USER,
            password: process.env.MAIL_PASS
      },
      MAIL_HOST: process.env.MAIL_HOST,
      UNHASHED_PASSWORD: process.env.UNHASHED_PASSWORD,
};

export default CONFIG;