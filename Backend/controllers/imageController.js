const admin = require('firebase-admin');


const bucket = admin.storage().bucket();

const imageController = {
    getAllImages: async (req, res) => {
        try {
          const firestore = admin.firestore();
          const imagesCollection = firestore.collection('Images');
    
          const querySnapshot = await imagesCollection.get();
    
          const images = [];
          querySnapshot.forEach((doc) => {
            images.push(doc.data());
          });
    
          res.status(200).json({ images });
        } catch (error) {
          console.error('Error fetching images:', error);
          res.status(500).json({ error: 'Internal server error.' });
        }
      },

      editImage: async (req, res) => {
        try {
          //  console.log(req.params , req);
          const imageName = req.params.imageName;
          if (!req.file) {
            return res.status(400).json({ error: 'No file provided.' });
          }
          if (!imageName) {
            return res.status(400).json({ error: 'No name provided.' });
          }
          const imageBuffer = req.file.buffer;
    
          const fileUpload = bucket.file(req.file.originalname);
          const fileStream = fileUpload.createWriteStream();
          fileStream.end(imageBuffer);
    
          fileStream.on('finish', async () => {
            const newDownloadUrl = await fileUpload.getSignedUrl({
              action: 'read',
              expires: '03-09-2025', // Set an appropriate expiration date
            });
    
            if (!newDownloadUrl) {
              return res.status(400).json({ error: 'Error generating new download URL.' });
            }
    
            const firestore = admin.firestore();
            const imagesCollection = firestore.collection('Images');
    
            // Find the document with the given imageName and update its imageUrl
            const querySnapshot = await imagesCollection.where('name', '==', imageName).get();
            
            if (querySnapshot.empty) {
              return res.status(404).json({ error: 'Image not found.' });
            }
    
            const docRef = querySnapshot.docs[0].ref;
            const oldImageUrl = querySnapshot.docs[0].data().iconName; // Get the old image URL
      
            // Delete the old image file from storage
            if (oldImageUrl) {
              //const oldImageName = oldImageUrl.split('/').pop();
              const oldImageFile = bucket.file(oldImageUrl);
              if(oldImageFile != null)
              await oldImageFile.delete();
            }

           // const docRef = querySnapshot.docs[0].ref;
            await docRef.update({ imageUrl: newDownloadUrl[0] , iconName: req.file.originalname });
    
            console.log('Name:', imageName);
            console.log('Image Size:', imageBuffer.length);
    
            res.status(200).json({ message: 'Image updated successfully.', downloadUrl: newDownloadUrl[0] });
          });
        } catch (error) {
          console.error('Error updating image:', error);
          res.status(500).json({ error: 'Internal server error.' });
        }
      },
};

module.exports = imageController;
