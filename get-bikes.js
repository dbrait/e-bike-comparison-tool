const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const csvPath = path.join(__dirname, '..', 'backend', 'e-bikes.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    return {
      statusCode: 200,
      body: JSON.stringify(records)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read data' })
    };
  }
};
