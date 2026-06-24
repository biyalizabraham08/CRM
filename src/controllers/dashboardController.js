const Lead = require('../models/Lead')
const FollowUp= require('../models/FollowUp')

exports.getDashBoardStats = async (req,res) =>{
    try{
       const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const total = await Lead.countDocuments({
    createdBy: req.user.id,
    isDeleted: false
});

const convertedLeads = await Lead.countDocuments({
    createdBy: req.user.id,  // Add this filter
    status: "Converted",
    isDeleted: false
});

const pendingFollowUps = await FollowUp.countDocuments({
    followUpDate: { $gte: new Date() }  // Use 'followUpDate' not 'nextFollowUpDate'
});

const todaysFollowUps = await FollowUp.countDocuments({
    followUpDate: { $gte: startOfDay, $lte: endOfDay }  // Match today's date
});

       res.status(200).json({
        total,
        convertedLeads,
        pendingFollowUps,
        todaysFollowUps
       })

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

}

