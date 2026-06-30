const mongoose = require('mongoose');
const Lead = require('../models/Lead')
const FollowUp = require('../models/FollowUp')
const User = require('../models/User')

exports.getDashboardStats = async (req, res) => {
  try {
    let leadFilter = { isDeleted: false };
    let followupFilter = {};

    // Employee sees only assigned leads
    if (req.user.role === "employee") {
      leadFilter.assignedTo = new mongoose.Types.ObjectId(req.user.id);
      
      const userLeads = await Lead.find({ assignedTo: req.user.id }).select('_id');
      const userLeadIds = userLeads.map(l => l._id);
      followupFilter.lead = { $in: userLeadIds };
    }

    const totalLeads = await Lead.countDocuments(leadFilter);

    const convertedLeads = await Lead.countDocuments({
      ...leadFilter,
      status: "Converted",
    });

    const pendingFollowups = await FollowUp.countDocuments({
      ...followupFilter,
      status: "Pending",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysFollowups = await FollowUp.countDocuments({
      ...followupFilter,
      followUpDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    
    const recentLeads = await Lead.find(leadFilter)
        .sort({ _id: -1 })
        .limit(5);

    const upcomingFollowUps = await FollowUp.find({
        ...followupFilter,
        status: 'Pending'
    })
        .populate('lead', 'name')
        .sort({ followUpDate: 1 })
        .limit(5);

    const statusDistribution = await Lead.aggregate([
        { $match: leadFilter },
        { $group: { _id: "$status", value: { $sum: 1 } } },
        { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    const response = {
      total: totalLeads,
      convertedLeads,
      pendingFollowUps: pendingFollowups,
      todaysFollowUps: todaysFollowups,
      recentLeads,
      upcomingFollowUps,
      statusDistribution
    };

    // Admin gets one extra statistic
    if (req.user.role === "admin") {
      response.totalEmployees = await User.countDocuments({
        role: "employee",
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
