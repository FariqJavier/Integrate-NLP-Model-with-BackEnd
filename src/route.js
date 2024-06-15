const logger = require('./utils/logger');
const TeksDataService = require('./service/teks_data.service'); 
const TeksDataController = require('./controller/teks_data.controller');

const teksDataService = new TeksDataService();
const teksDataController = new TeksDataController( teksDataService );

function routes(app) {
    // Test api
    app.get('/test', async (req, res) => {
      try {
        logger.debug(`Full Request: ${req.body}`);
        res.status(201).json({ message: 'Test successful' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });

     // Endpoint to save Text Data for NLP
     app.post('/nlp/data/:user_id', async (req, res) => {
        try { 
          await teksDataController.createNewTeksData(req, res) } catch (error) { }
      });
  }
  
  module.exports = routes;