// controllers/userController.js
const userModel = require('../models/userModel');
const admin = require('firebase-admin');
const fcm = admin.messaging();
var cron = require('node-cron');
const moment = require('moment');
const authController = require('./authController')
const historyModel = require('../models/historyModel')
const userController  = {

  async getAllUsers(req, res) {
    try {
      const users = await userModel.getAllUsersWithAuth();
      res.json({ success: true, users });
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  },

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      if(!userId) {
        return res.status(400).json({ success: false, error: 'Bad Request' });
      }
      const user = await userModel.getUserById(userId);

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
      } else {
        res.json({ success: true, user });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  },

  async createUser(req, res) {
    try {
      const newUser = req.body;
      if (!newUser || Object.keys(newUser).length === 0 ||
      !newUser.Score) {
        res.status(400).json({ success: false, error: 'Bad Request' });
        return;
      }
      const userId = await userModel.createUser(newUser);
      res.status(201).json({ success: true, userId });

      const Adminname  = await authController.getuidFromToken(req);

      await historyModel.AddHistoryData(Adminname,"created new user", newUser.Name ,"");
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updatedUser = req.body;
      if (!userId || Object.keys(updatedUser).length === 0 ||
      !updatedUser.Score) {
        res.status(400).json({ success: false, error: 'Bad Request' });
        return;
      }
      const existingUser = await userModel.getUserById(userId);
      if (!existingUser) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      await userModel.updateUser(userId, updatedUser);
      res.json({ success: true, message: 'User updated successfully' });

      const Adminname  = await authController.getuidFromToken(req);

      await historyModel.AddHistoryData(Adminname,"updated user", updatedUser.Name ,"");
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({ success: false, error: 'Bad Request' });
        return;
      }
      const existingUser = await userModel.getUserById(userId);

      if (!existingUser) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      await userModel.deleteUser(userId);
      res.json({ success: true, message: 'User deleted successfully' });

      const Adminname  = await authController.getuidFromToken(req);

      await historyModel.AddHistoryData(Adminname,"deleted user", existingUser.Name ,"");
    } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  }
,



  async sendNotificationold(req,res){
    try {
      const message = req.body.message;
      const title = req.body.title;
      const datetime = req.body.datetime; 
      if (!message || !title) {
        res.status(400).json({ success: false, error: 'Bad Request' });
        return;
      }
      var task = cron.schedule('* * * * * *', () => {
        console.log('running a task every minute');
      });
    
          // Get tokens of users with the 'token' field set
          const userTokens = await userModel.getAllUsersWithToken();
          console.log(title);
          // Construct the FCM payload
          const notifications = userTokens.map(token => {
            return {
              notification: {
                title: title,
                body: message,
              },
              token: token,
            };
          });
      
          if (notifications.length === 0) {
            return res.status(400).json({ success: false, error: 'No users with tokens found.' });
          }
  
      fcm.sendEach(notifications)
        .then(response => {
          console.log('Notification sent:', response);
          res.status(200).json({ success: true });
        })
        .catch(error => {
          console.error('Error sending notification:', error);
          res.status(400).json({ success: false, error: 'Bad Request' });
        });
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  },
  async sendNotification(req, res) {
    try {
      const timezone = 'Africa/Tunis'
      const message = req.body.message;
      const title = req.body.title;
      const datetime = req.body.datetime; // Assuming datetime is provided in the request

      if (!message || !title) {
        res.status(400).json({ success: false, error: 'Bad Request' });
        return;
      }

      if (datetime) {
        const scheduledTime = moment(datetime); // Parse datetime string
        const now = moment();
        
        if (scheduledTime.isBefore(now)) {
          res.status(400).json({ success: false, error: 'Scheduled time must be in the future.' });
          return;
        }
        console.log(scheduledTime.format('m H D M *'));
        // Schedule the task to send the notification
        var valid = cron.validate(scheduledTime.format('m H D M *'));
        if(!valid){ res.status(400).json({ success: false, error: 'Time is not valid.' }); }
        const task = cron.schedule(scheduledTime.format('m H D M *'), async() => {
          console.log("hello",message, title);
          await userController.sendNotificationNow(message, title, res);
          // Stop the scheduled task
         // this.scheduledTask.stop();
         
         // task.stop();
        }, {
          scheduled: true,
          timezone: timezone
        });

        res.status(200).json({ success: true, message: 'Notification scheduled.' });
        const Adminname  = await authController.getuidFromToken(req);
        await historyModel.AddHistoryData(Adminname,"scheduled notification that will be sent", "to all users on" , scheduledTime.format('DD/MM/YYYY hh:mm:ss'));
      } else {
        userController.sendNotificationNow(message, title, res);
        const Adminname  = await authController.getuidFromToken(req);
        await historyModel.AddHistoryData(Adminname,"sent a notification", "to all users","");
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ success: false, error: 'Bad Request' });
    }
  },

  async sendNotificationNow(message, title, res) {

    if (res.headersSent) {
    console.log("yo");
    }
   
    // Get tokens of users with the 'token' field set
    const userTokens = await userModel.getAllUsersWithToken();
    console.log(title);
    // Construct the FCM payload
    const notifications = userTokens.map(token => {
      return {
        notification: {
          title: title,
          body: message,
        },
        token: token,
      };
    });

    if (notifications.length === 0) {
  
      if (!res.headersSent) {
      return res.status(400).json({ success: false, error: 'No users with tokens found.' });
    }
    }

    fcm.sendEach(notifications)
      .then(response => {
        console.log('Notification sent:', response);
        if (!res.headersSent) {
        res.status(200).json({ success: true });
        }
      })
      .catch(error => {
        console.error('Error sending notification:', error);
        if (!res.headersSent) {
        res.status(400).json({ success: false, error: 'Bad Request' });
        }
      });
  }

}




module.exports = userController;
