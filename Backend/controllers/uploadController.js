const admin = require('firebase-admin');

const bucket = admin.storage().bucket();

const uploadController = {
  uploadImage: async (req, res) => {
    try {
      const name = req.body.name;
      console.log(req);
      const imageBuffer = req.file.buffer;

      const fileUpload = bucket.file(req.file.originalname);
      const fileStream = fileUpload.createWriteStream();
      fileStream.end(imageBuffer);

      fileStream.on('finish', async () => {
        const downloadUrl = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-09-2025', // Set an appropriate expiration date
        });

        const firestore = admin.firestore();
        // const imagesDocument = firestore.collection('UrlRss').doc('images');

        // await imagesDocument.set({
        //   [name]: downloadUrl[0],
        // }, { merge: true });

        const urlsCollection = firestore.collection('Images');
        // Save the download URL to the Firestore collection
        const docRef = await urlsCollection.add({
            name: name,
            imageUrl: downloadUrl[0],
            iconName : req.file.originalname
        });
        console.log('Document written with ID: ', docRef.id);
        console.log('Name:', name);
        console.log('Image Size:', imageBuffer.length);

        res.status(200).json({ message: 'File uploaded successfully.', downloadUrl: downloadUrl[0] });
      });
    } catch (error) {
      console.error('Error uploading file to Firebase Storage:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  },
};

module.exports = uploadController;