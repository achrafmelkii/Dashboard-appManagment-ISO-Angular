

                      /*            Challenges routes     */

const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');



   router.post('/addChallenge',challengeController.createChallenge);
   router.get('/getChallenges',challengeController.getAllChallenge);
   router.get('/getChallenById/:id', challengeController.getChellengeById);
   router.put('/updateChallenge/:id',   challengeController.updateChallenge);
   router.delete('/deleteChallenge/:id',   challengeController.deleteChallenge);


   
   router.post('/assignChallenge/:userId/:challengeId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const challengeId = req.params.challengeId;
  
      const result = await challengeController.assignChallengeToUser(userId, challengeId);
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });



  router.put('/markChallengeAsCompleted/:userId/:challengeId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const challengeId = req.params.challengeId;
  
      const result = await challengeController.markChallengeAsCompleted(userId, challengeId);
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  router.post('/isChallengeAssigned/:userId/:challengeId',async (req, res) => {
    try {
      const userId = req.params.userId;
      const challengeId = req.params.challengeId;
  
      const result = await challengeController.isChallengeAssigned(userId, challengeId);
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });



    module.exports = router  