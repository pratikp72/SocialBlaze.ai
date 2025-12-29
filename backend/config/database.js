import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/socialblaze';
    console.log('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n⚠️  Make sure MongoDB is running!');
    console.error('   - Check MongoDB Compass is open');
    console.error('   - Or start MongoDB service: net start MongoDB');
    console.error('   - Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/socialblaze');
    throw error;
  }
};

export default connectDB;

