const request = require('supertest');
const express = require('express');
const { createAIRecommendation } = require('../controllers/recommendationController');
const { createAIItinerary } = require('../controllers/itineraryController');

const app = express();
app.use(express.json());
app.post('/recommendation', createAIRecommendation);
app.post('/itinerary', createAIItinerary);

describe('Controller Tests', () => {
  it('should create a recommendation', async () => {
    const response = await request(app)
      .post('/recommendation')
      .send({
        location: 'Paris',
        preferences: ['Cultural', 'Food']
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('recommendation');
  });

  it('should create an itinerary', async () => {
    const response = await request(app)
      .post('/itinerary')
      .send({
        location: 'Paris',
        preferences: ['Cultural', 'Food'],
        days: 3
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('itinerary');
  });
});
