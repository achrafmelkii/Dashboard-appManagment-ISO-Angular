const historyModel = require('../models/historyModel')

const historyController = {

    getAllhistory: async (req, res) => {
        try {
          const history = await historyModel.getAllHistories();
          res.status(200).json({ history:history });
        } catch (error) {
          console.error('Error fetching history:', error);
         // res.status(500).json({ error: 'Internal server error.' });
          return res.status(400).send('Error fetching history');
        }
      }

}

module.exports = historyController;