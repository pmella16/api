
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const fs = require('fs');

const app = express();
const PORT = 5555;
const MAX_FILE_SIZE = 1000;


//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));


app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '1000mb' }));


app.get('/playlist', async (req, res, next) => {
  const data = [
    {"id": "1", "title": "video de prueba", "desc": "esto es un video de prueba", "url": "http://192.168.3.14:5555/videos/VID_20230705_210345.mp4"},
    {"id": "4", "title": "video de prueba", "desc": "esto es un video de prueba", "url": "http://192.168.3.14:5555/videos/VID_20230718_194307~2.mp4"},
    { "id": "5", "title": "video de prueba", "desc": "esto es un video de prueba", "url": "http://192.168.3.14:5555/videos/VID_20230722_233955.mp4"},
    { "id": "7", "title": "video de prueba", "desc": "esto es un video de prueba", "url": "http://192.168.3.14:5555/videos/VID_20230722_234731.mp4"},


  ]
  res.send(data);
});

// Serve static files (videos) from the "uploads" directory
app.use('/videos', express.static('uploads'));

app.put('/upload-full', async (req, res) => {
  const contentDisposition = req.headers['content-disposition'];
  const filenameRegex = /filename="([^"]+)"/;
  const matches = contentDisposition.match(filenameRegex);
  const filename = matches[1];

  try {
    let fileSize = 0;
    const filePath = 'uploads/' + filename;
    const writeStream = fs.createWriteStream(filePath);

    req.on('data', (chunk) => {
      fileSize += chunk.length; // Incrementa el tamaño del archivo
      writeStream.write(chunk); // Escribe los fragmentos de datos en el archivo
    });

    req.on('end', () => {
      writeStream.end(); // Finaliza la escritura en el archivo
      console.log('fileSize', fileSize);
      console.log('filePath', filePath);
      res.status(200).json({ message: 'Archivo subido exitosamente' });
    });
  } catch (err) {
    res.status(500).send(err);
  }
});


app.put('/upload-corta', async (req, res) => {
  const contentDisposition = req.headers['content-disposition'];
  const filenameRegex = /filename="([^"]+)"/;
  const matches = contentDisposition.match(filenameRegex);
  const filename = matches[1];

  try {
    let fileSize = 0;
    const filePath = 'uploads/' + filename;
    const writeStream = fs.createWriteStream(filePath);

    req.on('data', (chunk) => {
      fileSize += chunk.length; // Incrementa el tamaño del archivo

      if (fileSize > MAX_FILE_SIZE * 1024 * 1024) { // Verifica el tamaño límite (10 megabytes)
        writeStream.end(); // Finaliza la escritura en el archivo

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        res.status(413).json({ message: 'El tamaño del archivo excede el límite permitido' });
        req.destroy(); // Termina la solicitud para evitar que siga subiendo el archivo
      } else {
        writeStream.write(chunk); // Escribe los fragmentos de datos en el archivo
      }
    });

    req.on('end', () => {
      writeStream.end(); // Finaliza la escritura en el archivo

      if (fileSize <= MAX_FILE_SIZE * 1024 * 1024) { // Verifica el tamaño límite (10 megabytes)
        res.status(200).json({ message: 'Archivo subido exitosamente' });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});


app.put('/upload-ios', async (req, res) => {

  const contentDisposition = req.headers['content-disposition'];
  const filenameRegex = /filename="([^"]+)"/;
  const matches = contentDisposition.match(filenameRegex);
  const filename = matches[1];

  console.log('filename', filename);
  console.log('req', req);
  try {
    const writeStream = fs.createWriteStream('uploads/'+filename);

    req.on('data', (chunk) => {
      console.log('chunk', chunk);
      writeStream.write(chunk); // Escribe los fragmentos de datos en el archivo
    });
  
    req.on('end', () => {
      console.log('end', writeStream);
      writeStream.end(); // Finaliza la escritura en el archivo
  
      res.status(200).json({ message: 'Archivo subido exitosamente' });
    });    

  } catch (err) {
      res.status(500).send(err);
  }
});

//app.listen(PORT, '192.168.3.14', () => {
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
