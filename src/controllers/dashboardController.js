const mongoose = require('mongoose');
const Lead = require('../models/Lead')
const FollowUp = require('../models/FollowUp')

exports.getDashBoardStats = async (req,res) =>{
    try{
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const userId = req.user.id;

        const userLeads = await Lead.find({ createdBy: userId, isDeleted: false }).select('_id');
        const userLeadIds = userLeads.map(l => l._id);

        const total = userLeads.length;

        const convertedLeads = await Lead.countDocuments({
            createdBy: userId,
            status: "Converted",
            isDeleted: false
        });

        const pendingFollowUps = await FollowUp.countDocuments({
            lead: { $in: userLeadIds },
            followUpDate: { $gte: new Date() }
        });

        const todaysFollowUps = await FollowUp.countDocuments({
            lead: { $in: userLeadIds },
            followUpDate: { $gte: startOfDay, $lte: endOfDay }
        });

        // 1. Recent Leads
        const recentLeads = await Lead.find({
            createdBy: userId,
            isDeleted: false
        }).sort({ createdAt: -1 }).limit(5).select('name company status _id');

        // 2. Upcoming Follow-ups
        const upcomingFollowUps = await FollowUp.find({
            lead: { $in: userLeadIds },
            followUpDate: { $gte: startOfDay }
        }).sort({ followUpDate: 1 }).limit(5).populate('lead', 'name');

        // 3. Status Distribution
        const statusDistribution = await Lead.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(userId), isDeleted: false } },
            { $group: { _id: { $cond: [ { $eq: ["$status", null] }, "New", "$status" ] }, count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            total,
            convertedLeads,
            pendingFollowUps,
            todaysFollowUps,
            recentLeads,
            upcomingFollowUps,
            statusDistribution: statusDistribution.map(item => ({
                name: item._id || 'New',
                value: item.count
            }))
        })

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}
