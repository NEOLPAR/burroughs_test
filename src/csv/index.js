const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');
const path = require('path');

class Csv {
  static getCsv = (obj) => convertArrayToCSV(obj);

  static exportCsv = async (obj) => {
    const csvContent = this.getCsv(obj);
    const dir = './export';
    const filePath = path.join(dir, this.#createFileName());

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    try {
      fs.writeFile(filePath, csvContent, (err) => err);
    } catch (err) {
      return err;
    }

    return filePath;
  };

  static #createFileName = () => `${new Date().toISOString().split('.')[0].replace(/:/g, '.')}.csv`;
}

module.exports = Csv;
