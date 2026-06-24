require('dotenv').config();
const mongoose = require('mongoose');
const { getDashBoardStats } = require('./src/controllers/dashboardController');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);

    const req = {
        user: { id: "60a7d51939108a3240e1e6b3" } // Dummy valid ObjectId string
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
        await getDashBoardStats(req, res);
    } catch (e) {
        console.error("Test Error:", e);
    }
    process.exit(0);
}

test();
