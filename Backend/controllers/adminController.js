// controllers/userController.js
const adminModel = require('../models/adminModel');
const authController = require('./authController')
const historyModel = require('../models/historyModel')
class AdminController {
  async getAllAdmins(req, res) {
    try {

      const users = await adminModel.getAllAdmins();
      //console.table(users);
      res.json({ success: true, admins:users });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  }

  async getAdminById(req, res) {
    try {
      const userId = req.params.id;
      if(!userId){
        res.status(400).json({ success: false, error: 'Empty request body' });
      }
      const user = await adminModel.getAdminById(userId);

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
      } else {
        res.json({ success: true, user });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  }

  async createAdmin(req, res) {
    try {


      const newUser = req.body;
      if (!newUser || Object.keys(newUser).length === 0) {
        res.status(400).json({ success: false, error: 'Empty request body' });
        return;
      }
      const userId = await adminModel.createAdmin(newUser);
      res.status(201).json({ success: true, userId });

      const Adminname  = await authController.getuidFromToken(req);

      await historyModel.AddHistoryData(Adminname,"added",newUser.name , "as admin");
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  }

  async updateAdmin(req, res) {
    try {
      const userId = req.params.id;
      const updatedUser = req.body;

      if (!updatedUser || Object.keys(updatedUser).length === 0 || !userId) {
        res.status(400).json({ success: false, error: 'Empty request body' });
        return;
      }

      const existingUser = await adminModel.getAdminById(userId);
      if (!existingUser) {
        res.status(404).json({ success: false, error: 'Admin not found' });
        return;
      }

      await adminModel.updateAdmin(userId, updatedUser);
      
      res.json({ success: true, message: 'Admin updated successfully' });

      const Adminname  = await authController.getuidFromToken(req);

    await historyModel.AddHistoryData(Adminname,"updated admin",updatedUser.name , "");
      
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  }

  async deleteAdmin(req, res) {
    try {
      const userId = req.params.id;
      if(!userId)
      {
        res.status(400).json({ success: false, error: 'Empty request body' });
        return;
      }
      const existingUser = await adminModel.getAdminById(userId);

      if (!existingUser) {
        res.status(404).json({ success: false, error: 'Admin not found' });
        return;
      }

      await adminModel.deleteAdmin(userId);
      res.json({ success: true, message: 'Admin deleted successfully' });

      const Adminname  = await authController.getuidFromToken(req);

      await historyModel.AddHistoryData(Adminname,"removed the admin status from",existingUser.name , "");
     
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  }


  async getUsersEmails(req, res) {
    try {
      const users = await adminModel.getAllNonAdminUsers();
      res.json({ success: true, users:users });
     
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  }

  
  async getAllhistory (req, res)  {
    try {
      const history = await historyModel.getAllHistories();
      res.status(200).json({ success: true, history:history });
    } catch (error) {
      console.error('Error fetching history:', error);
     // res.status(500).json({ error: 'Internal server error.' });
      return res.status(400).send('Error fetching history');
    }
  }


}

module.exports = new AdminController();
