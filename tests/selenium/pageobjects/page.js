/**
	@brief Most basic class for "Page Object" pattern.
	@see http://webdriver.io/guide/testrunner/pageobjects.html
*/

'use strict';

const nodeUrl = require( 'url' );

class Page {
	constructor() {
		this.title = 'My Page';
	}
	open( path ) {
		browser.url( '/wiki/' + path );
	}

	getWhenExists( selector ) {
		browser.waitForExist( selector );
		return $( selector );
	}

	getWhenVisible( selector ) {
		browser.waitForVisible( selector );
		return $( selector );
	}

	/** @brief Check if current user is logged into MediaWiki */
	get isLoggedIn() {
		return browser.execute( function() {
			return mw.user.getId() !== 0;
		} ).value;
	}

	/**
		@brief Select $link by selector. Adds $link.query field to the returned $link.
	*/
	getLink( selector ) {
		var $link = $( selector );

		/* Note: we can't use browser.execute() to run mw.Uri(...).query,
			because in MediaWiki 1.23 it doesn't add 'title' parameter
			for URLs like "/wiki/Cat?action=edit" */

		Object.defineProperty( $link, 'query', {
			get: function() {
				var url = nodeUrl.parse( $link.getAttribute( 'href' ), true, true ),
					query = url.query;

				if ( !query.title ) {
					/* URL like "/wiki/Cat?action=edit" */
					var title = url.pathname.split( '/' ).pop();
					if ( title != 'index.php' ) {
						query.title = title;
					}
				}

				return query;
			}
		} );

		return $link;
	}
}

module.exports = Page;
