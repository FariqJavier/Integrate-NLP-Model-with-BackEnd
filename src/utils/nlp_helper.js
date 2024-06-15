const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');

// Load the model
async function loadModel() {
    const modelUrl = 'http://127.0.0.1:8080/model_js/natural_language_processing/model.json';
    
    console.log('Loading model from:', modelUrl);
    const model = await tf.loadLayersModel(modelUrl);
    console.log('Model loaded successfully');

    const vocabulary = loadVocabulary( ); // Load vocabulary after model is loaded
    const labelEncoder = loadLabelEncoder( ); // Load label encoder after model is loaded

    return { model, vocabulary, labelEncoder }
}

// Load the vocabulary
function loadVocabulary() {
    const vocabPath = path.join(__dirname, '../../data/vocabulary.json');

    // Check if vocab file exists
    if (fs.existsSync(vocabPath)) {
        const vocabulary = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
        console.log('Vocabulary loaded');
        return vocabulary;

    } else {
        console.error('Vocab file not found:', vocabPath);
    }
}

// Load the label_encoder
function loadLabelEncoder() {
    const labelPath = path.join(__dirname, '../../data/label_encoder.json');

    // Check if label_encoder file exists
    if (fs.existsSync(labelPath)) {
        const labelEncoder = JSON.parse(fs.readFileSync(labelPath, 'utf8'));
        console.log('Label Encoder loaded');
        return labelEncoder;
    } else {
        console.error('Label Encoder file not found:', labelPath);
    }
}

// Preprocess text
function preprocessText(text) {
    // Remove numbers and extra spaces
    const cleanedText = text.replace(/\d+/g, '').replace(/\s+/g, ' ').trim();
    // Remove letters and extra spaces, keep only numbers
    const cleanedNumber = text.replace(/[a-zA-Z]+/g, '').replace(/\s+/g, ' ').trim();
    return {cleanedText, cleanedNumber};
}

// Convert text to bag-of-words representation
function textToSequence( text, vocabulary ) {
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
function decodePredictedClass( predictedClass, labelEncoder) {
    const decodedClass = labelEncoder.classes[predictedClass];
    return decodedClass
}

module.exports = { loadModel, preprocessText, textToSequence, decodePredictedClass }