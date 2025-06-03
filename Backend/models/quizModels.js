
const admin = require('firebase-admin');
const { getFirestore, Timestamp, FieldValue, Filter, } = require('firebase-admin/firestore');
class QuizModel {

  async getAllQuizezs() {
    const snapshot = await admin.firestore().collection('quizzes').doc('questions').get(); //added .doc
    return snapshot.exists ? snapshot.data() : null;
  }



  async getQuizById(fieldName) {
    try {
      const quizDoc = await admin.firestore().collection('quizzes').doc('questions').get();
  
      if (quizDoc.exists) {
        console.log('quiz exists');
        const fieldData = quizDoc.get(fieldName);
        // console.log(`Retrieved field : `,fieldName, fieldData);
        return fieldData;
      } else {
        console.log(`Quiz  not found.`);
        return null;
      }
    } catch (error) {
      console.error(`Error retrieving field '${fieldName}' from quiz :`, error);
      throw error;
    }
  }


  async deleteQuiz(quizId) {
    await admin.firestore().collection('quizzes').doc('questions').update({
      [quizId]: admin.firestore.FieldValue.delete()
    });
  }
   async updateQuiz(QuizId, UpdatedQuiz) {
    await admin.firestore().collection('quizzes').doc('questions').update({
      [QuizId]: UpdatedQuiz
    });
  }


  async createQuiz(newQuiz) {
    try {
      //const db = getFirestore();
     // const res = await db.collection('quizzes').doc('questions').set(newQuiz);
    const docRef = await admin.firestore().collection('quizzes').doc('questions').set(newQuiz,{merge:true});

    // newQuiz.id = docRef.id;
    // await docRef.set({ id: docRef.id });
    return docRef.Text;  
    } catch (error) {
        throw error;
      }
  }
}

module.exports = new QuizModel();
