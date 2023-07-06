
const express = require('express');

const app = express();
const PORT = 5555;


app.get('/xml', async (req, res, next) => {
  res.send('xml');
});
app.get('/upload', async (req, res, next) => {
  res.send('upload');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
