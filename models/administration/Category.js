const fs = require('fs');
const path = require('path');

class Category {

	static getFilePath(type) {
		switch (type) {
			case 'incidents':
				return path.join(__dirname, '../../data/incCategories.json');
			case 'requests':
				return path.join(__dirname, '../../data/reqCategories.json');
			case 'changes':
				return path.join(__dirname, '../../data/chgCategories.json');
			default:
				throw new Error('Unknown Category type');
		}
	}

	static async getData(filePath) {
		return JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
	}

	static async updateFile(filePath, newData) {
		try {
			await fs.promises.writeFile(filePath, JSON.stringify(newData));
			return newData;
		}
		catch (e) {
			console.log(e);
			throw new Error('Could not re-write the file ' + filePath);
		}
	}
};

module.exports = Category;

