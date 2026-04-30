const { getDashboardData } = require('./dashboard.service');

const getDashboardController = async (req, res, next) => {
  try {
    const { recentLimit } = req.query;
    const data = await getDashboardData({ recentLimit: parseInt(recentLimit, 10) || 5 });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardController };