const fs = require('fs');
const path = require('path');

class Category {

	static getFilePath(type) {
		switch (type) {
			case 'INC':
				return '../data/incCategories.json';
			case 'REQ':
				return '../data/reqCategories.json';
			case 'CHG':
				return '../data/chgCategories.json';
			default:
				throw new Error('Unknow Category type');
		}
	}

	static async updateFile(filePath, newData) {
		try {
			return await fs.promises.writeFile(path.join(__dirname, filePath), JSON.stringify(newData));
		}
		catch (e) {
			console.log(e);
			throw new Error('Could not re-write the file ' + filePath);
		}
	}
};

module.exports = Category;

