const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');
const path = require('path');

class Csv {
  static getCsv = (obj) => convertArrayToCSV(obj);

  static exportCsv = (obj) => {
    const csvContent = this.getCsv(obj);
    const dir = './export';
    const filePath = path.join(dir, this.#createFileName());

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    fs.writeFile(filePath, csvContent, (err) => err ?? true);
  };

  static #createFileName = () => `${new Date().toISOString().split('.')[0].replace(/:/g, '.')}.csv`;
}

module.exports = Csv;
