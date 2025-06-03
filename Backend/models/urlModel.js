// models/userModel.js
const admin = require('firebase-admin');
const bucket = admin.storage().bucket();

class UrlModel {
  async getFeedUrl() {
    const userDoc = await admin.firestore().collection('UrlRss').doc('url').get();
    return userDoc.exists ? userDoc.data() : null;
  }

  async getVideoUrl() {
    const userDoc = await admin.firestore().collection('UrlRss').doc('videoUrl').get();
    return userDoc.exists ? userDoc.data() : null;
  }

  async getPolitiqueUrl() {
    const userDoc = await admin.firestore().collection('UrlRss').doc('politiquepdf').get();
    return userDoc.exists ? userDoc.data() : null;
  }

  async updateVideo(videoBuffer, fileName) {
    try {
        const firestore = admin.firestore();
        const videoDoc = await firestore.collection('UrlRss').doc("videoUrl").get();
        
        if (!videoDoc.exists) {
            throw new Error('Video not found.');
        }     

        const oldvideoName = videoDoc.data().fileName;
        const oldvideoUrl = videoDoc.data().url;

        if (videoBuffer && fileName) {
            const fileUpload = bucket.file(fileName);
            const fileStream = fileUpload.createWriteStream();
            fileStream.end(videoBuffer);

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
                    await videoDoc.ref.update({ url: newDownloadUrl[0],fileName:fileName });

                    // Delete the old image file from storage
                    if (oldvideoUrl && oldvideoName !== fileName ) {
                        const oldImageFile = bucket.file(oldvideoName);
                        if(oldImageFile != null)
                        await oldImageFile.delete();
                    }

                    resolve({ message: 'Video updated successfully.', downloadUrl: newDownloadUrl[0] });
                });

                fileStream.on('error', (error) => {
                    reject(error);
                });
            });
        }

        return { message: 'Video updated successfully.' };
    } catch (error) {
        console.error('Error updating video:', error);
        throw new Error('Internal server error.');
    }
 }   

 async updateFeedUrl(updatedurl) {
    const FeedDoc = await admin.firestore().collection('UrlRss').doc('url').get();
    if(!FeedDoc.exists){
        throw new Error('Url not found.');
    }
    await FeedDoc.ref.update({ link: updatedurl });
  }

  async updatePDFUrl(updatedurl) {
    const PDFDoc = await admin.firestore().collection('UrlRss').doc('politiquepdf').get();
    if(!PDFDoc.exists){
        throw new Error('PDF Url not found.');
    }
    await PDFDoc.ref.update({ url: updatedurl });
  }

}

module.exports = new UrlModel();
