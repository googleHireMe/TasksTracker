const StudyItems = require('../../models/StudyItem');

module.exports = getStudyItems = async (request, response) => {
  const itemId = request.params.id;
  const result = await StudyItems.findById(itemId);
  response.json(result);
}