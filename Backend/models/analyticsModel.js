// models/analytics.js
const admin = require('firebase-admin');


class analyticsModel {
  async getAnalyticsData() {
    const analyticsCollection  = await admin.firestore().collection('analytics').get();

    const dates = [];
    
    const NbEngagesChallenge = [];
    const NbEngagesQuiz = [];
    const NbNewUsers = [];

    const NbUsers = [];
    const NbUsersAR = [];
    const NbUsersChallenge = [];

    const NbUsersQuiz = [];
    const NbUsersReminder = [];

    analyticsCollection.forEach(doc => {
      const data = doc.data();
      const date = doc.id; // Assuming the date is the document ID

      // Check if X, Y, and Z exist in the document's data
      if ('NbUsersAR' in data && 'NbEngagesQuiz' in data && 'NbUsersReminder' in data) {
        dates.push(date);
        NbUsersAR.push(data.NbUsersAR);
        NbEngagesQuiz.push(data.NbEngagesQuiz);
        NbUsersReminder.push(data.NbUsersReminder);
      }
    });
    return {
      dates: dates,
      NbEngagesQuiz: NbEngagesQuiz,
      NbUsersAR: NbUsersAR,
      NbUsersReminder: NbUsersReminder
    };
  }
}

module.exports = new analyticsModel();
