const challengeModel = require('../models/challengeModel');
const userModel = require('../models/userModel')
const authController = require('./authController')
const historyModel = require('../models/historyModel')

class ChallengeController {

  async getAllChallenge(req, res) {
    try {
      const challenges = await challengeModel.getChallenges();
      res.json({ success: true, challenges });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  async getChellengeById(req, res) {
    try {
      const challengeId = req.params.id;
      const challenge = await challengeModel.getChallengeById(challengeId);

      if (!challenge) {
        res.status(404).json({ success: false, error: 'challenge not found' });
      } else {
        res.json({ success: true, challenge });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }


async createChallenge(req, res) {
  try {
    const newChallenge = req.body;
    const challengeId = await challengeModel.createChallenge(newChallenge);
 
    const users = await userModel.getAllUsers();

  
    await Promise.all(users.map(async user => {
      try {
        if (!user.Challenges) {
          user.Challenges = [];
        }
        user.Challenges.push({ challengeId: challengeId, status: false });
        await userModel.updateUser(user.ID, user); 
      } catch (error) {
        console.error(`Error assigning challenge to user ${user.id}:`, error);
      }
    }));

    res.status(201).json({ success: true, challengeId });

    const Adminname  = await authController.getuidFromToken(req);

    await historyModel.AddHistoryData(Adminname,"added new challenge",newChallenge.Title , "");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}


  async updateChallenge(req, res) {
    try {
      const challengeId = req.params.id;
      const updatedChallenge = req.body;
   console.log(req.body)
      const existingChallenge = await challengeModel.getChallengeById(challengeId);
      if (!existingChallenge) {
        res.status(404).json({ success: false, error: 'Challenge not found' });
        return;
      }

      await challengeModel.updateChallenge(challengeId, updatedChallenge);
      res.json({ success: true, message: ' Challenge updated successfully' });

      const Adminname  = await authController.getuidFromToken(req);

      await historyModel.AddHistoryData(Adminname,"updated challenge",updatedChallenge.Title);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  async deleteChallenge(req, res) {
    try {
      const challengeId = req.params.id;
      const existingChallenge = await challengeModel.getChallengeById(challengeId);

      if (!existingChallenge) {
        res.status(404).json({ success: false, error: ' Challenge not found' });
        return;
      }

      const users = await userModel.getAllUsers();

    await Promise.all(users.map(async user => {
      try {
        if (user.Challenges) {
          user.Challenges = user.Challenges.filter(challenge => challenge.challengeId !== challengeId);
          await userModel.updateUser(user.ID, user); 
        }
      } catch (error) {
        console.error(`Error removing challenge from user ${user.id}:`, error);
      }
    }));
      await challengeModel.deleteChallenge(challengeId);
      res.json({ success: true, message: 'challenge deleted successfully' });

      const Adminname  = await authController.getuidFromToken(req);

      await historyModel.AddHistoryData(Adminname,"deleted challenge",existingChallenge.Title , "");
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }









  async assignChallengeToUser(userId, challengeId) {
    try {
      const user = await userModel.getUserById(userId);
      const challenge = await challengeModel.getChallengeById(challengeId);
  
      if (!user || !challenge) {
        throw new Error('User or challenge not found');
      }
  
      if (!user.Challenges) {
        user.Challenges = [];
      }
  
      user.Challenges.push({ challengeId: challengeId, status: false });
      await userModel.updateUser(userId, user);
  
      return { success: true, message: 'Challenge assigned to user successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  async markChallengeAsCompleted(userId, challengeId) {
    try {
      const user = await userModel.getUserById(userId);
  
      if (!user) {
        throw new Error('User not found');
      }
  
      const userChallenge = user.Challenges.find(c => c.challengeId === challengeId);
      if (!userChallenge) {
        throw new Error('Challenge not found for this user');
      }
  
      userChallenge.status = true;
  
      await userModel.updateUser(userId, user);
  
      return { success: true, message: 'Challenge marked as completed for user successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
 




}

module.exports = new ChallengeController();
