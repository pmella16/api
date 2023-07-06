
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = 5555;

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '500mb' }));

app.get('/xml', async (req, res, next) => {
  res.send('xml');
});
app.get('/upload', async (req, res, next) => {
  res.send('upload');
});


app.put('/upload-avatar', (req, res) => {

  
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
