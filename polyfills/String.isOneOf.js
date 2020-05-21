String.prototype.isOneOf = function (possibilities) {
	return possibilities.indexOf(this.valueOf()) >= 0;
}