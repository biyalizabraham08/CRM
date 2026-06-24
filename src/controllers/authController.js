const User = require('../models/User');
const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Please provide name, email, and password' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashedPassword, role: 'admin' });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
};

exports.demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo@crmpro.com';
    let user = await User.findOne({ email: demoEmail });

    // If demo user exists, completely wipe it and its data to reset the sandbox
    if (user) {
      const userLeads = await Lead.find({ createdBy: user._id }).select('_id');
      const userLeadIds = userLeads.map(l => l._id);
      
      await FollowUp.deleteMany({ lead: { $in: userLeadIds } });
      await Lead.deleteMany({ createdBy: user._id });
      await User.deleteOne({ _id: user._id });
    }

    // Create fresh demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('DemoPassword123!', salt);
    
    user = new User({ 
      name: 'Demo Sandbox User', 
      email: demoEmail, 
      password: hashedPassword, 
      role: 'admin' 
    });
    await user.save();

    // Seed Dummy Leads (Ensure all statuses exactly match the enum)
    const dummyLeads = [
      { name: 'John Smith', email: 'john.s@example.com', mobile: '9876543210', company: 'Acme Corp', status: 'New', createdBy: user._id },
      { name: 'Sarah Connor', email: 'sarah.c@techsolutions.com', mobile: '9876543211', company: 'Tech Solutions', status: 'Contacted', createdBy: user._id },
      { name: 'Michael Scott', email: 'm.scott@dundermifflin.com', mobile: '9876543212', company: 'Dunder Mifflin', status: 'Interested', createdBy: user._id },
      { name: 'Tony Stark', email: 't.stark@starkindustries.com', mobile: '9876543213', company: 'Stark Industries', status: 'Converted', createdBy: user._id },
      { name: 'Bruce Wayne', email: 'b.wayne@wayneent.com', mobile: '9876543214', company: 'Wayne Enterprises', status: 'Not Interested', createdBy: user._id }
    ];

    const createdLeads = await Lead.insertMany(dummyLeads);

    // Seed a couple of follow-ups for the dashboard charts
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await FollowUp.insertMany([
      { lead: createdLeads[0]._id, followUpDate: new Date(), notes: 'Initial contact call.' },
      { lead: createdLeads[1]._id, followUpDate: tomorrow, notes: 'Follow up on proposal.' }
    ]);

    // Issue token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '24h', // Longer expiry for demo
    });

    res.json({ token });
  } catch (error) {
    console.error('Demo Login Error:', error);
    res.status(500).json({ error: 'Failed to generate demo session: ' + error.message });
  }
};
