const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://dcanevarollo:j672fb3i@omnistack-1nrd1.mongodb.net/devmap?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors({ origin: 'http://localhost:3000' }));  // Authorizes the React app to access the API.
app.use(express.json());
app.use(routes);

app.listen(3333);
