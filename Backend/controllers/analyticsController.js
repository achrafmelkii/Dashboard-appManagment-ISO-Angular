const analyticsModel = require('../models/analyticsModel');
const analyticsController = {
    getAllanalytics: async (req, res) => {
        try {
          const analytics = await analyticsModel.getAnalyticsData(); // Add "await" here
          res.status(200).json({ success: true,analytics: analytics });
        } catch (error) {
          console.error('Error fetching analytics:', error);
          return res.status(400).send('Error fetching analytics');
        }
    }
};

module.exports = analyticsController;
