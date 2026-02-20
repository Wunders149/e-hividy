const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://razafimahefaphilibert7_db_user:H3ClFMQ7I0KRRuoN@cluster0.sh1mvhi.mongodb.net/shop?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected!');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

module.exports = mongoose;
