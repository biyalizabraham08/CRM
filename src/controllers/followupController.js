const Followup = require ('../models/FollowUp');


exports.createFollowup = async (req, res) => {
    try {
        console.log("createFollowup req.body:", req.body);
        const { lead, notes, followUpDate } = req.body;

        if(!lead||!notes||!followUpDate) {
            console.log("Missing fields! lead:", lead, "notes:", notes, "followUpDate:", followUpDate);
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const followup = new Followup({ lead, notes, followUpDate });
        await followup.save();
        res.status(201).json(followup);
    } catch (error) {
        console.error("createFollowup error:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllFollowups = async (req,res) => {
    try{
        const followups =  await Followup.find().populate("lead")
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
        const followup = await Followup.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate("lead");
        if(!followup){
            return res.status(404).json({error:"Followup not found"})
        }
        res.json(followup)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.deleteFollowup = async (req,res) => {
    try{
        const followup = await Followup.findByIdAndDelete(req.params.id).populate("lead");
        if(!followup){
            return res.status(404).json({error:"Followup not found"})
        }
        res.json(followup)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}