const Followup = require ('../models/FollowUp');
const Lead = require('../models/Lead');


exports.createFollowup = async (req, res) => {
    try {
        console.log("createFollowup req.body:", req.body);
        const { lead, notes, followUpDate, status } = req.body;

        if(!lead||!notes||!followUpDate) {
            console.log("Missing fields! lead:", lead, "notes:", notes, "followUpDate:", followUpDate);
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        if (req.user.role === 'employee') {
            const leadExists = await Lead.findOne({ _id: lead, assignedTo: req.user.id });
            if (!leadExists) {
                return res.status(403).json({ error: 'Access denied. You can only add follow-ups to your assigned leads.' });
            }
        }

        const followup = new Followup({ lead, notes, followUpDate, status: status || 'Pending' });
        await followup.save();
        res.status(201).json(followup);
    } catch (error) {
        console.error("createFollowup error:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllFollowups = async (req,res) => {
    try{
        let filter = {};
        if (req.user.role === 'employee') {
            const userLeads = await Lead.find({ assignedTo: req.user.id }).select('_id');
            const userLeadIds = userLeads.map(l => l._id);
            filter.lead = { $in: userLeadIds };
        }
        const followups =  await Followup.find(filter).populate("lead")
        res.status(200).json(followups)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getFollowupsByLead = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({error:"Lead ID required"})
        }

        if (req.user.role === 'employee') {
            const leadExists = await Lead.findOne({ _id: id, assignedTo: req.user.id });
            if (!leadExists) return res.status(403).json({ error: "Access denied" });
        }

        const followups = await Followup.find({ lead: id }).populate("lead");
        res.json(followups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllFollowupsById = async (req, res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({error:"Followup ID required"})
        }

        const followups = await Followup.find({ _id: id }).populate("lead");
        res.json(followups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateFollowup= async (req,res) => {
    try{
        const existing = await Followup.findById(req.params.id);
        if(!existing) return res.status(404).json({error:"Followup not found"});
        
        if (req.user.role === 'employee') {
            const leadExists = await Lead.findOne({ _id: existing.lead, assignedTo: req.user.id });
            if (!leadExists) return res.status(403).json({ error: "Access denied" });
        }

        const followup = await Followup.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate("lead");
        res.json(followup)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteFollowup = async (req,res) => {
    try{
        const existing = await Followup.findById(req.params.id);
        if(!existing) return res.status(404).json({error:"Followup not found"});
        
        if (req.user.role === 'employee') {
            const leadExists = await Lead.findOne({ _id: existing.lead, assignedTo: req.user.id });
            if (!leadExists) return res.status(403).json({ error: "Access denied" });
        }

        const followup = await Followup.findByIdAndDelete(req.params.id).populate("lead");
        res.json(followup)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}