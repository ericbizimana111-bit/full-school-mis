
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const cleanDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('🗑️  Cleaning database...');

        // Drop all collections
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.drop();
            console.log(`✅ Dropped collection: ${collection.collectionName}`);
        }

        console.log('\n✨ Database cleaned successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Clean error:', error);
        process.exit(1);
    }
};

cleanDatabase();