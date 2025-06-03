const admin = require('firebase-admin');
const bucket = admin.storage().bucket();

class SymbolModel {
  async getAllSymbols() {
    try {
      const firestore = admin.firestore();
      const symbolsCollection = firestore.collection('symboles');
      const querySnapshot = await symbolsCollection.get();
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error fetching symbols:', error);
      throw new Error('Internal server error.');
    }
  }

  async createSymbol(newSymbol, imageBuffer, fileName) {
    try {

      const fileUpload = bucket.file(fileName);
      const fileStream = fileUpload.createWriteStream();
      fileStream.end(imageBuffer);

      return new Promise((resolve, reject) => {
        fileStream.on('finish', async () => {
          const downloadUrl = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-09-2025', // Set an appropriate expiration date
          });

          if (!downloadUrl) {
            throw new Error('Error generating download URL.');
          }

          const firestore = admin.firestore();
          const symbolsCollection = firestore.collection('symboles');
          const docRef = await symbolsCollection.add({ imageUrl: downloadUrl[0], iconName: fileName, desc: newSymbol.desc, title: newSymbol.title });
          await docRef.update({ ID: docRef.id });

          resolve({ message: 'Symbol created successfully.', downloadUrl: downloadUrl[0] });
        });

        fileStream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error creating symbol:', error);
      throw new Error('Internal server error.');
    }
  }

  async deleteSymbol(symbolId, imageName) {
    try {
      const firestore = admin.firestore();
      const symbolsCollection = firestore.collection('symboles');
      const querySnapshot = await symbolsCollection.where('ID', '==', symbolId).get();

      if (querySnapshot.empty) {
        throw new Error('Symbol not found.');
      }

      const docRef = querySnapshot.docs[0].ref;

      await docRef.delete();

      // Delete the associated image file from storage
      const imageFile = bucket.file(querySnapshot.docs[0].data().iconName);
      if (imageFile != null) {
        await imageFile.delete();
      }

      return { message: 'Symbol deleted successfully.' };
      
    } catch (error) {
      console.error('Error deleting symbol:', error);
      throw new Error('Internal server error.');
    }
  }

  async updateSymbol(symbolId, updatedSymbol, imageBuffer, fileName) {
    try {
        const firestore = admin.firestore();
        const symbolsCollection = firestore.collection('symboles');

        // Find the symbol document by ID
        const querySnapshot = await symbolsCollection.where('ID', '==', symbolId).get();

        if (querySnapshot.empty) {
            throw new Error('Symbol not found.');
        }

        const docRef = querySnapshot.docs[0].ref;
        const oldImageUrl = querySnapshot.docs[0].data().iconName;

        // Update the symbol details
        await docRef.update(updatedSymbol);

        // If a new image is provided, upload it and update the imageUrl
        if (imageBuffer && fileName) {
            const fileUpload = bucket.file(fileName);
            const fileStream = fileUpload.createWriteStream();
            fileStream.end(imageBuffer);

            await new Promise((resolve, reject) => {
                fileStream.on('finish', async () => {
                    const newDownloadUrl = await fileUpload.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2025', // Set an appropriate expiration date
                    });

                    if (!newDownloadUrl) {
                        reject(new Error('Error generating new download URL.'));
                    }

                    // Update the imageUrl with the new image URL
                    await docRef.update({ imageUrl: newDownloadUrl[0],iconName:fileName });

                    // Delete the old image file from storage
                    if (oldImageUrl && oldImageUrl !== fileName ) {
                        const oldImageFile = bucket.file(oldImageUrl);
                        if(oldImageFile != null)
                        await oldImageFile.delete();
                    }

                    resolve({ message: 'Symbol updated successfully.', downloadUrl: newDownloadUrl[0] });
                });

                fileStream.on('error', (error) => {
                    reject(error);
                });
            });
        }

        return { message: 'Symbol updated successfully.' };
    } catch (error) {
        console.error('Error updating symbol:', error);
        throw new Error('Internal server error.');
    }
}

  // You can add more methods as needed

}

module.exports = new SymbolModel();
