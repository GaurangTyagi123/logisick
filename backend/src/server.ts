import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL!).then((con) => {
    if (con) console.log('Connection successfull');
    else console.log('Connection failed');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
