const logger = require('./utils/logger');
const { loadModel, preprocessText, textToSequence, decodePredictedClass } = require('./utils/nlp_helper');

let model, vocabulary, labelEncoder;

// Load the model and related data once at startup
loadModel().then(loaded => {
    model = loaded.model;
    vocabulary = loaded.vocabulary;
    labelEncoder = loaded.labelEncoder;
    logger.info('Model and data loaded successfully at startup');
}).catch(error => {
    logger.error('Error loading model:', error);
});

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

    // Endpoint to handle predictions
    app.post('/predict/nlp', async (req, res) => {
        try {
            const input = req.body.input; // Assuming the input is in the request body

            const preprocessInput = preprocessText(input)
            const inputSequence = textToSequence(preprocessInput, vocabulary)

            const prediction = model.predict(inputSequence); // generate a tensor of 9 class probabilities for input

            // Assuming the prediction is a tensor with probabilities, get the class with the highest probability
            const predictedClass = prediction.argMax(-1).dataSync()[0];
            const decodedPredictedClass = decodePredictedClass(predictedClass, labelEncoder)

            logger.info(`Prediction for '${input}' is Label '${decodedPredictedClass}'`)
            res.json({ predictedLabel : decodedPredictedClass });
        } catch (error) {
            logger.error('Error Predict for Input:', error)
            res.status(500).send(error.message);
        }
    });

  }
  
  module.exports = routes;