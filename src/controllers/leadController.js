const Lead = require('../models/Lead')
const User = require('../models/User')





exports.createLead = async (req,res) => {
  try {
    const {
      name,
      email,
      mobile,
      company,
      status,
      assignedTo,
    } = req.body;

    let employee = null;
    if (assignedTo) {
      employee = await User.findById(assignedTo);
      if (!employee) {
        return res.status(404).json({
          message: "User not found",
        });
      }
    }

    const lead = await Lead.create({
      name,
      email,
      mobile,
      company,
      status,
      assignedTo: assignedTo || null,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Lead created and assigned successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }}




exports.getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let filter = { isDeleted: false };
    const assignedToFilter = req.query.assignedTo;

    // If employee, show only assigned leads
    if (req.user.role === "employee") {
      filter.assignedTo = req.user.id;
    } else if (assignedToFilter) {
      filter.assignedTo = assignedToFilter;
    }

    // Admin will see all leads because no assignedTo filter is added

    const total = await Lead.countDocuments(filter);

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name email")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateLead = async (req,res) => {
    try{
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if(!lead){
            return res.status(404).json({error:"Lead not found"})
        }
        res.status(200).json(lead)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

exports.deleteLead = async (req,res) => {
    try{
        const lead = await Lead.findByIdAndUpdate(req.params.id,{
            isDeleted:true
        },{new:true})
        if(!lead){
            return res.status(404).json({error:"Lead not found"})
        }
        res.status(200).json({message:"Lead deleted successfully"})
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

exports.searchLeads = async (req, res) => {
    try {
        const { name, email, mobile, company, status, assignedTo } = req.query;

        const query = { isDeleted: false };
        if (req.user.role === 'employee') {
            query.assignedTo = req.user.id;
        } else if (assignedTo) {
            query.assignedTo = assignedTo;
        }
        
        const orConditions = [];

        if (name) {
            orConditions.push({ name: { $regex: name, $options: 'i' } });
        }
        if (email) {
            orConditions.push({ email: { $regex: email, $options: 'i' } });
        }
        if (mobile) {
            orConditions.push({ mobile: { $regex: mobile, $options: 'i' } });
        }

        if (orConditions.length > 0) {
            query.$or = orConditions;
        }

        const leads = await Lead.find(query).populate('assignedTo', 'name email');
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.filterByStatus= async (req,res) =>{
    try{

        const {status, assignedTo} = req.query
        if(!status){
            return res.status(400).json({error:"Status is required"})
        } 
        
        const query = { isDeleted: false, status };
        if (req.user.role === 'employee') {
            query.assignedTo = req.user.id;
        } else if (assignedTo) {
            query.assignedTo = assignedTo;
        }
        
        const leads = await Lead.find(query).populate('assignedTo', 'name email');
        res.status(200).json(leads)
    }
    catch{
        res.status(500).json({error: "error.message"})

    }
}

exports.getLeadById = async (req, res) => {
    try {
        const query = { _id: req.params.id, isDeleted: false };
        if (req.user.role === 'employee') {
            query.assignedTo = req.user.id;
        }
        const lead = await Lead.findOne(query).populate('assignedTo', 'username email name');
        if (!lead) {
            return res.status(404).json({ error: "Lead not found" });
        }
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};