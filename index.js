const express = require('express');
const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 1337;

let model;
let vocabulary = {};
let labelEncoder = {};

// Load the model
async function loadModel() {
    const modelUrl = 'http://127.0.0.1:8080/model_js/natural_language_processing/model.json';
    
    console.log('Loading model from:', modelUrl);
    model = await tf.loadLayersModel(modelUrl);
    console.log('Model loaded successfully');

    loadVocabulary(); // Load vocabulary after model is loaded
    loadLabelEncoder(); // Load label encoder after model is loaded
}

// Load the vocabulary
function loadVocabulary() {
    const vocabPath = './vocabulary.json';

    // Check if vocab file exists
    if (fs.existsSync(vocabPath)) {
        vocabulary = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
        console.log('Vocabulary loaded');
    } else {
        console.error('Vocab file not found:', vocabPath);
    }
}

// Load the label_encoder
function loadLabelEncoder() {
    const labelPath = './label_encoder.json';

    // Check if label_encoder file exists
    if (fs.existsSync(labelPath)) {
        labelEncoder = JSON.parse(fs.readFileSync(labelPath, 'utf8'));
        console.log('Label Encoder loaded');
    } else {
        console.error('Label Encoder file not found:', labelPath);
    }
}

// Preprocess text
function preprocessText(text) {
    // Remove numbers and extra spaces
    const cleanedText = text.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
    return cleanedText;
}

// Convert text to bag-of-words representation
function textToSequence(text) {
    const words = text.split(' ');
    const vector = new Array(Object.keys(vocabulary).length).fill(0);

    words.forEach(word => {
        const index = vocabulary[word];
        if (index !== undefined) {
            vector[index] = 1;
        }
    });

    return tf.tensor2d([vector]);
}

// decode predicted label 
function decodePredictedClass(predictedClass) {
    const decodedClass = labelEncoder.classes[predictedClass];
    return decodedClass
}

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle predictions
app.post('/predict', async (req, res) => {
    try {
        const input = req.body.input; // Assuming the input is in the request body
        const preprocessInput = preprocessText(input)
        const inputSequence = textToSequence(preprocessInput)
        const prediction = model.predict(inputSequence); // generate a tensor of 9 class probabilities for input

        // Assuming the prediction is a tensor with probabilities, get the class with the highest probability
        const predictedClass = prediction.argMax(-1).dataSync()[0];
        const decodedPredictedClass = decodePredictedClass(predictedClass)

        res.json({ predictedLabel : decodedPredictedClass });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server and load the model
app.listen(PORT, async () => {
    await loadModel();
    console.log(`Server is running on port ${PORT}`);
});