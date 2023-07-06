
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const multer = require('multer');

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


app.get('/xml', async (req, res, next) => {
  res.send('xml');
});
app.get('/upload', async (req, res, next) => {
  res.send('upload');
});


app.put('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    console.log('req.files', req.file);

      if(!req.file) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
  

          const avatar = req.file;

          console.log('avatar', avatar);
          
          //Use the mv() method to place the file in the upload directory (i.e. "uploads")
          avatar.mv('./uploads/' + avatar.name);

          //send response
          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: avatar.name,
                  mimetype: avatar.mimetype,
                  size: avatar.size
              }
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
