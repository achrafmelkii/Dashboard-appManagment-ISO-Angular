const QuizModel = require('../models/quizModels.js');
const authController = require('./authController')
const historyModel = require('../models/historyModel')
class quizController{

    async getAllQuizezs(req, res) {
        try {
          const quizs = await QuizModel.getAllQuizezs();
   
          res.json({ success: true, quizs});
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      }


      async getQuizById(req, res) {
        try {
          const quizId = req.params.id;
          const quiz = await QuizModel.getQuizById(quizId);
    
          if (!quiz) {
            res.status(404).json({ success: false, error: 'quiz not found' });
          } else {
            console.log('waaw',quiz);
            res.json({ success: true, oneQuizs:quiz });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      }

      async deleteQuiz(req, res) {
        try {
          const quizId = req.params.id;
          const existingQuiz = await QuizModel.getQuizById(quizId);
    
          if (!existingQuiz) {
            res.status(404).json({ success: false, error: 'quiz not found' });
            return;
          }
          else{
             await QuizModel.deleteQuiz(quizId);

            res.json({ success: true, message: 'quiz deleted successfully' });

            const Adminname  = await authController.getuidFromToken(req);

            await historyModel.AddHistoryData(Adminname,"deleted quiz",existingQuiz.Text ,"");
     
          }
         
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      }



      
      async updateQuiz(req, res) {
        try {
          const quizId = req.params.id;
          const updatedQuiz = req.body;
    
          if (!quizId || !updatedQuiz) {
            res.status(404).json({ success: false, error: 'No details provided.' });
            return;
          }
          const existingQuiz = await QuizModel.getQuizById(quizId);
          
          if (!existingQuiz) {
            res.status(404).json({ success: false, error: 'quiz not found' });
            return;
          }
    
          await QuizModel.updateQuiz(quizId, updatedQuiz);
          console.log('quiz updated');
          res.json({ success: true, message: 'quiz updated successfully' });

          
          const Adminname  = await authController.getuidFromToken(req);
          console.log(Adminname);

          await historyModel.AddHistoryData(Adminname,"updated quiz",updatedQuiz.Text ,"");
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      }

      async createQuiz(req, res) {
        try {
          console.log(req.body);
          const newQuiz = req.body;
          const quizId = await QuizModel.createQuiz(newQuiz);
          res.status(201).json({ success: true, quizId });

          const Adminname  = await authController.getuidFromToken(req);

          await historyModel.AddHistoryData(Adminname,"added new quiz",updatedQuiz.Text ,"");
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
      } 
}

module.exports = new quizController();