const express = require('express');
const db = require('./models');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorHandler');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/api', routes);

app.use(errorMiddleware);

db.sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
