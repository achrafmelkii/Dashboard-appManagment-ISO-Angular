const admin = require('firebase-admin');

class HistoryModel {

    async getAllHistories() {
      //console.log("hello");
      const snapshot = await admin.firestore().collection('historique').get();
      return snapshot.docs.map(doc =>{
        
        const data = doc.data();
        data.date = data.date.toDate();
        return data;
      
      
      } );
    }
  
  
    async getHistoryById(historicId) {
      const userDoc = await admin.firestore().collection('historique').doc(historicId).get();
      return userDoc.exists ? userDoc.data() : null;
    }
  
    async AddHistory(historic) {
      try {
      
      const docRef = await admin.firestore().collection('historique').add(historic);
      await docRef.update({ ID: docRef.id });
      // newUser.ID = docRef.id;
      // await docRef.update({ ID: docRef.id });
      return docRef.id;  
      } catch (error) {
          throw error;
        }
    }
  
    async updateHistory(historic) {
      await admin.firestore().collection('historique').doc(historic.ID).set(historic, { merge: true });
    }
  
    async deleteHistory(historicId) {
  
      await admin.firestore().collection('historique').doc(historicId).delete();
    }
  
    
    
    async AddHistoryData(adminName,action,data,endaction ){

      const history = {
        "admin": adminName,
        "action": action,
        "data":  data,
        "endaction" :endaction,
        "date" : new Date()
      };
      try {
      
        const docRef = await admin.firestore().collection('historique').add(history);
        await docRef.update({ ID: docRef.id });
        // newUser.ID = docRef.id;
        // await docRef.update({ ID: docRef.id });
        return docRef.id;  
        } catch (error) {
            throw error;
        }
    }
  
  
  }
  
  module.exports = new HistoryModel();