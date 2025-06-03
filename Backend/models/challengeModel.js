const admin = require('firebase-admin');


class ChallengeModel {
    async getChallenges() {
      const snapshot = await admin.firestore().collection('challenges').get();
      return snapshot.docs.map(doc => doc.data());
    }




    async getChallengeById(challengeId) {
        const challengeDoc = await admin.firestore().collection('challenges').doc(challengeId).get();
        return challengeDoc.exists ? challengeDoc.data() : null;
      }
    
      async createChallenge(newChallenge) {
        try {
        const docRef = await admin.firestore().collection('challenges').add(newChallenge);
        newChallenge.ID = docRef.id;
        await docRef.update({ ID: docRef.id });
        return docRef.id;  
        } catch (error) {
            throw error;
        }    
    }
    async updateChallenge(challengeId, updatedChallenge) {
        await admin.firestore().collection('challenges').doc(challengeId).set(updatedChallenge, { merge: true });
      }

        async deleteChallenge(challengeId) {
            await admin.firestore().collection('challenges').doc(challengeId).delete();
          }
}

module.exports = new ChallengeModel();
