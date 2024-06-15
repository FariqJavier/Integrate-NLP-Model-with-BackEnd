const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const TeksDataService = require('../service/teks_data.service');

class TeksDataController {

    /**
     * @param {TeksDataService} teksDataService
     */
    constructor(teksDataService) {
        this.teksDataService = teksDataService;
    }

    async createNewTeksData(req, res) {
        try {
            const textDataUUID = uuidv4();

            const { user_id } = req.params;
            const { teksData } = req.body;
            const { cleanedText, cleanedNumber, predictedLabel } = await this.teksDataService.preprocessTextAndpredictLabel(teksData);
            const data = {
                teks_data_id: textDataUUID,
                user_id,
                teks: cleanedText,
                price: cleanedNumber,
                label: predictedLabel,
            };

            const newTeksData = await this.teksDataService.createTeksData(data);
            logger.info(`New Teks Data for User '${user_id}' has been created Successfully`);
            res.status(201).json({
                message: `New Teks Data for User '${user_id}' has been created Successfully`,
                data: newTeksData
            })
        } catch (error) {
            logger.error(`Failed to create New Teks Data for User:`, error)
        }
    }
}

module.exports = TeksDataController;