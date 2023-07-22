
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const fs = require('fs');

const app = express();
const PORT = 5555;
const MAX_FILE_SIZE = 100;


//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));


const octetStreamParser = bodyParser.raw({
  type: "application/octet-stream"
});


app.put('/upload-full', octetStreamParser, async (req, res) => {
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

      if (fileSize > MAX_FILE_SIZE * 1024 * 1024) { // Verifica el tamaño límite (10 megabytes)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        res.status(413).json({ message: 'El tamaño del archivo excede el límite permitido' });
      } else {
        res.status(200).json({ message: 'Archivo subido exitosamente' });
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});


app.put('/upload-corta', octetStreamParser, async (req, res) => {
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


app.put('/upload-ios', octetStreamParser, async (req, res) => {

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

app.listen(PORT, '192.168.3.14', () => {
//app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
