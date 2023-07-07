
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const fs = require('fs');

const app = express();


const PORT = 5555;

// enable files upload

//add other middleware
app.use(cors());

//app.use('/uploads', express.static('uploads'));

const octetStreamParser = bodyParser.raw({
  inflate: false,
  type: "application/octet-stream",
  limit: "500mb",
});

app.get('/xml', async (req, res, next) => {
  res.send('xml');
});
app.get('/upload', async (req, res, next) => {
  res.send('upload');
});


app.put('/upload-avatar', octetStreamParser, async (req, res) => {

  
  try {
    const writeStream = fs.createWriteStream('uploads/archivo.mp4');

    req.on('data', (chunk) => {
      writeStream.write(chunk); // Escribe los fragmentos de datos en el archivo
    });
  
    req.on('end', () => {
      writeStream.end(); // Finaliza la escritura en el archivo
  
      res.status(200).json({ message: 'Archivo subido exitosamente' });
    });    

  } catch (err) {
      res.status(500).send(err);
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
