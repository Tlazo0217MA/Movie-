
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;


require('./config/firebaseConfig'); 

const reviewRoutes = require('./routes/reviewRoutes');
const ratingRoutes = require('./routes/ratingRoutes'); 

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Review Platform Backend is Running!');
});
app.use('/api/reviews', reviewRoutes);
app.use('/api/ratings', ratingRoutes); 


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access: http://localhost:${PORT}`);
});