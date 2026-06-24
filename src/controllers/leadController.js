const Lead = require('../models/Lead')
const user = require('../models/User')





exports.createLead = async (req,res) => {
    try{
    const { name,email,mobile,company,status,isDeleted } = req.body
    const createdBy = req.user.id

    if(!name||!email||!mobile||!company){
        return res.status(400).json({error:"Please provide all required fields"})
    }

    const lead = new Lead({ name,email,mobile,company,status,isDeleted,createdBy })
    await lead.save()
    res.status(201).json(lead)
}catch(error){
    res.status(500).json({error:error.message})
}}


exports.getAllLeads = async (req,res) => {
    try{
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const filter = { 
  createdBy: req.user.id,
  isDeleted: false
 };
        const total = await Lead.countDocuments(filter);
        const leads = await Lead.find(filter)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            data: leads,
        });
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

exports.getLeadById = async (req,res) => {
    try{
        const lead = await Lead.findById(req.params.id)
        if(!lead){
            return res.status(404).json({error:"Lead not found"})
        }
        res.status(200).json(lead)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

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
        const { name, email, mobile, company, status } = req.query;

        const query = { isDeleted: false, createdBy: req.user.id };
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

        const leads = await Lead.find(query);
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.filterByStatus= async (req,res) =>{
    try{

        const {status} = req.query
        if(!status){
            return res.status(400).json({error:"Status is required"})
        } 
        const leads= await Lead.find({isDeleted:false, status, createdBy: req.user.id})
        res.status(200).json(leads)
    }
    catch{
        res.status(500).json({error: "error.message"})

    }
}


exports.page