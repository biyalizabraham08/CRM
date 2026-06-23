const Lead = require('../models/Lead')




exports.createLead = async (req,res) => {
    try{
    const { name,email,mobile,company,status,isDeleted} = req.body

    if(!name||!email||!mobile||!company){
        return res.status(400).json({error:"Please provide all required fields"})
    }

    const lead = new Lead({ name,email,mobile,company,status,isDeleted })
    await lead.save()
    res.status(201).json(lead)
}catch(error){
    res.status(500).json({error:error.message})
}}


exports.getAllLeads = async (req,res) => {
    try{
        const Leads = await Lead.find({isDeleted:false})
        res.status(200).json(Leads)
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