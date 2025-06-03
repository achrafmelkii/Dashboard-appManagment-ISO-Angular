const admin = require('firebase-admin');
const sharp = require('sharp');
const mime = require('mime-types');
var path = require('path');
const bucket = admin.storage().bucket();
const SymbolModel = require('../models/symbolModel');
const authController = require('./authController')
const historyModel = require('../models/historyModel')
const symbolController = {
    getAllSymboles: async (req, res) => {
        try {
          const symbols = await SymbolModel.getAllSymbols();
          res.status(200).json({ images:symbols });
        } catch (error) {
          console.error('Error fetching images:', error);
         // res.status(500).json({ error: 'Internal server error.' });
          return res.status(400).send('Error fetching images');
        }
      },
    createSymbole: async (req, res) => {
        try {
          if (!req.file) {
           //eturn res.status(400).json({ error: 'No file provided.' });
            return res.status(400).send('No file provided.');
          }
          
          const imageBuffer = req.file.buffer;

          const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
          const fileExtension = path.extname(req.file.originalname).toLowerCase();

          if (!validImageExtensions.includes(fileExtension)) {
              return res.status(400).send('Invalid file type. Please upload an image. 1');
          }


          const mimeType = mime.lookup(req.file.originalname);

          if (!mimeType.startsWith('image/')) {
              return res.status(400).send('Invalid file type. Please upload an image. 2');
          }


          try {
            await sharp(imageBuffer).metadata(); // Check for image metadata
            // File is likely an image
          } catch (error) {
              console.log("no image");
              return res.status(400).send('Invalid file type. Please upload an image. 3');
          }

          if (!req.body || !req.body.desc || !req.body.title) {
           //return res.status(400).json({ error: 'No details provided.' });
            return res.status(400).send('No details provided.');
          }

          const newSymbol = {
            desc: req.body.desc,
            title: req.body.title
        };


          const result = await SymbolModel.createSymbol(newSymbol, req.file.buffer, req.file.originalname);
          res.status(201).json(result);

          const Adminname  = await authController.getuidFromToken(req);

          await historyModel.AddHistoryData(Adminname,"added new symbol",req.body.title ,"");
          } catch (error) {
            console.error('Error creating symbol:', error);
            //res.status(500).json({ error: 'Internal server error.' });
            return res.status(400).send('Error creating symbol');
          }
      },
    deleteSymbole: async (req, res) => {
        try {

          const symbolId = req.params.id;
          const imageName = req.body.imageName;
          if (!symbolId || !imageName) {
           // return res.status(400).json({ error: 'No details provided.' });
            return res.status(400).send('No details provided.');
          }
          const result = await SymbolModel.deleteSymbol(symbolId, imageName);
          res.status(200).json(result);
          const Adminname  = await authController.getuidFromToken(req);

          await historyModel.AddHistoryData(Adminname,"deleted symbol",imageName ,"");
        } catch (error) {
          console.error('Error deleting symbol:', error);
          //res.status(500).json({ error: 'Internal server error.' });
          return res.status(400).send('Error deleting symbol.');
        }
      },
    editSymbole: async (req, res) => {
        try {

            if (req.file) {
              const imageBuffer = req.file.buffer;
              const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
              const fileExtension = path.extname(req.file.originalname).toLowerCase();

              if (!validImageExtensions.includes(fileExtension)) {
                  return res.status(400).send('Invalid file type. Please upload an image. 1');
              }


              const mimeType = mime.lookup(req.file.originalname);

              if (!mimeType.startsWith('image/')) {
                  return res.status(400).send('Invalid file type. Please upload an image. 2');
              }


              try {
                await sharp(imageBuffer).metadata(); // Check for image metadata
                // File is likely an image
              } catch (error) {
                  return res.status(400).send('Invalid file type. Please upload an image. 3');
              }
              //return res.status(400).json({ error: 'No file provided.' });
            }


          // Dynamically import file-type module
         

          
     
          if (!req.params || !req.body || !req.params.id
            || !req.body.desc || !req.body.title) {
            //return res.status(400).json({ error: 'No details provided.' });
            return res.status(400).send('No details provided.');
          }
          const symbolId = req.params.id;
          const updatedSymbol = {
              desc: req.body.desc,
              title: req.body.title
          };

          const result = await SymbolModel.updateSymbol(symbolId, updatedSymbol, req.file?.buffer, req.file?.originalname);
          res.status(200).json(result);
          const Adminname  = await authController.getuidFromToken(req);

          await historyModel.AddHistoryData(Adminname,"updated symbol",req.body.title ,"");
        } catch (error) {
          console.error('Error updating image:', error);
          //res.status(500).json({ error: 'Internal server error.' });
          return res.status(400).send('Error updating image.');
        }
      },
};

module.exports = symbolController;
