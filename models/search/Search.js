const fs = require( 'fs' );
const path = require( 'path' );
const Incident = require( '../ticket/Incident' );
const Request = require( '../ticket/Request' );
const Change = require( '../ticket/Change' );

class Search {

	constructor ( type ) {
		this.type = type;
		this.model = this._getModel();
		this.searchParams = {};
	}

	_getModel () {
		switch ( this.type ) {
			case 'incidents':
				return Incident;
			case 'requests':
				return Request;
			case 'changes':
				return Change;
		}
	}

	async find ( query ) {
		if ( !query.startFrom )
			query.startFrom = 1;
		if ( !query.limit )
			query.limit = 20;

		this.searchParams = Object.entries( query ).reduce( ( searchParams, entry ) => {
			let [ prop, value ] = entry;
			const searchANumber = prop === 'escalation';
			const searchADate = prop.isOneOf( [ 'createdOn', 'updatedOn', 'dueDate' ] );

			//skip 'page'
			if ( prop.isOneOf( [ 'startFrom', 'limit', 'sort' ] ) )
				return searchParams;
			//prop is stored as a number
			if ( searchANumber ) {
				searchParams[ prop ] = value;
			}
			//search a date
			else if ( searchADate ) {
				value = dateToNum( value );
				console.log( value );
				searchParams[ prop ] = { $gte: value, $lte: value + 86400000 }; //date < results < date + 1 day
			}
			//search a string or a numbe rwithin a string
			else {
				value = value.split( ' ' ).join( '\\s' ); //handling white space 
				searchParams[ prop ] = { $regex: new RegExp( value ), $options: 'i' };
			}
			return searchParams;
		}, {} );

		const sort = query.sort || { sortBy: 'id', sortOrder: -1 };

		return await this.model
			.find( this.searchParams )
			.skip( parseInt( query.startFrom ) - 1 )
			.limit( parseInt( query.limit ) )
			.sort( { [ sort[ 'sortBy' ] ]: sort[ 'sortOrder' ] } );
	}

	async count () {
		return await this.model.countDocuments( this.searchParams );
	}
}

module.exports = Search;

function dateToNum ( date ) {
	date = date.split( '/' );
	[ date[ 0 ], date[ 1 ] ] = [ date[ 1 ], date[ 0 ] ];
	date = date.join( '/' );
	const num = new Date( date ).getTime();
	return num;
}

