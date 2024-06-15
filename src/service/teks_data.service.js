const TeksData = require('../model/teks_data.model');
const logger = require('../utils/logger');
const { loadModel, preprocessText, textToSequence, decodePredictedClass } = require('../utils/nlp_helper');
const { Op } = require('sequelize');
const moment = require('moment');

class TeksDataService {
    async loadNLPModel() {
        try {
            let model, vocabulary, labelEncoder;
            await loadModel().then(loaded => {
                model = loaded.model;
                vocabulary = loaded.vocabulary;
                labelEncoder = loaded.labelEncoder;
                logger.info('Model and data loaded successfully');
            });

            return {model, vocabulary, labelEncoder};
        } catch (error) {
            throw new Error('Error loading model:', error);
        }
    }

    async preprocessTextAndpredictLabel(teksData) {
        try {
            let {model, vocabulary, labelEncoder} = await this.loadNLPModel()
        
            const {cleanedText, cleanedNumber} = preprocessText(teksData)
            const inputSequence = textToSequence(cleanedText, vocabulary)
            
            const prediction = model.predict(inputSequence); // generate a tensor of 9 class probabilities for input

            // Assuming the prediction is a tensor with probabilities, get the class with the highest probability
            const predictedClass = prediction.argMax(-1).dataSync()[0];
            const predictedLabel = decodePredictedClass(predictedClass, labelEncoder);

            return {cleanedText, cleanedNumber, predictedLabel};
        } catch (error) {
            throw new Error(`Failed to predict the label: ${error}`);
        }
    }

    async createTeksData(data) {
      try {
        const teksData = await TeksData.create(data);
        return teksData;
      } catch (error) {
        throw new Error(`Failed to create Teks Data: ${error}`);
      }
    }

    async getLatestTeksDataByUserId(user_id) {
        try {
          const teksData = await TeksData.findOne({
            where: { user_id: user_id },
            order: [['timestamp', 'DESC']]
          });
          return teksData;
        } catch (error) {
          throw new Error(`Failed to create Teks Data: ${error}`);
        }
      }
  
    async getLastWeekTeksDataByUserId(user_id) {
      try {
        const lastTeksData = await this.getLatestTeksDataByUserId( user_id )
        if (!lastTeksData) {
            throw new Error(`User ID not found`)
        }
        const lastTimestamp = lastTeksData.timestamp;
        const startOfLastWeek = moment(lastTimestamp).subtract(7, 'days').toDate();

        const teksData = await TeksData.findAll({
          where: { 
            user_id: user_id,
            timestamp: {
                [Op.gte]: startOfLastWeek,
                [Op.lt]: lastTimestamp,
            },
          },
          order: [['timestamp', 'DESC']],
        });
        return teksData;
      } catch (error) {
        throw new Error(`Failed to get Last Week Teks Data User: ${error}`);
      }
    }
  }
  
  module.exports = TeksDataService;