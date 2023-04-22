// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());


// Database connection string
const uri = 'mongodb://localhost:27017/aggregation';

// Routes
app.get('/api/ads', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(uri);
    const db = client.db('aggregation');

    // Aggregate ads and companies collections
    const pipeline = [
        {
          $lookup: {
            from: 'companies',
            localField: 'companyId',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: {
            path: '$company',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $match: {
            $or: [
              {
                'company.name': {
                  $regex: req.query.q,
                  $options: 'i'
                }
              },
              {
                primaryText: {
                  $regex: req.query.q,
                  $options: 'i'
                }
              },
              {
                headline: {
                  $regex: req.query.q,
                  $options: 'i'
                }
              },
              {
                description: {
                  $regex: req.query.q,
                  $options: 'i'
                }
              }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            companyId: 1,
            primaryText: 1,
            headline: 1,
            description: 1,
            CTA: 1,
            imageUrl: 1,
            company: '$company.name'
          }
        }
      ];
      

    // Execute the pipeline and send the result
    const result = await db.collection('ads').aggregate(pipeline).toArray();
    res.send(result);

    // Close the MongoDB connection
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
