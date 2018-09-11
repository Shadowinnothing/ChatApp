const path = require('path');
const express = require('express');

// Pathname to talk to public folder
const publicPath = path.join(__dirname, '../public');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

app.listen(PORT, () => {
  console.log(`App is listening on Port: ${PORT}`);
});
