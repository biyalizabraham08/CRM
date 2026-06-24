require('dotenv').config();
const mongoose = require('mongoose');
const { createFollowup } = require('./src/controllers/followupController');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);

    const req = {
        body: {
            lead: "60a7d51939108a3240e1e6b3",
            notes: "Test notes",
            followUpDate: "2026-06-25"
        }
    };
    const res = {
        status: (code) => {
            console.log('Status:', code);
            return {
                json: (data) => console.log('JSON:', data)
            };
        }
    };

    try {
        await createFollowup(req, res);
    } catch (e) {
        console.error("Test Error:", e);
    }
    process.exit(0);
}

test();
