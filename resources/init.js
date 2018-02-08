/**
 * @license GPL-2.0-or-later
 * @author H. Snater < mediawiki@snater.com >
 * @author Daniel Werner < daniel.a.r.werner@gmail.com >
 * @author Adrian Heine <adrian.heine@wikimedia.de>
 */
( function ( dv, $, mw, wb, dataTypeStore, getExpertsStore, getParserStore ) {
	'use strict';

  var getValueViewBuilder = function () {
    var repoConfig = mw.config.get( 'wbRepo' ),
      repoApiUrl = repoConfig.url + repoConfig.scriptPath + '/api.php',
      mwApi = wb.api.getLocationAgnosticMwApi( repoApiUrl ),
      repoApi = new wb.api.RepoApi( mwApi ),
      userLanguages = mw.config.get( 'wgUserLanguage' ),
      contentLanguages = new wikibase.WikibaseContentLanguages(),
      formatterFactory = new wb.formatters.ApiValueFormatterFactory(
        new wb.api.FormatValueCaller(
          repoApi,
          dataTypeStore
        ),
        userLanguages
      ),
      parserStore = getParserStore( repoApi );
    return new wb.ValueViewBuilder(
      getExpertsStore( dataTypeStore ),
      formatterFactory,
      parserStore,
      userLanguages,
      {
        getMessage: function ( key, params ) {
          return mw.msg.apply( mw, [ key ].concat( params ) );
        }
      },
      contentLanguages,
      repoApiUrl,
      mw.config.get( 'wbGeoShapeStorageApiEndpoint' )
    );
  };
  var valueViewBuilder = getValueViewBuilder();

  $( ".oo-ui-inputWidget.wb-forms-valueview" ).each( function( i, elm ) {
    var $elm = $( elm ), dataType, propertyId;
    if( $elm.hasClass( "oo-ui-dropdownInputWidget" ) ) return;
    var classes = elm.className.split(" ");
    var match;
    for( var i = 0; i < classes.length; ++i ) {
      if( match = classes[i].match( /^wb-forms-(property|datatype)-(.*)$/ ) ) {
        switch( match[1] ) {
        case "property":
          propertyId = match[2];
          break;
        case "datatype":
          dataType = dataTypeStore.getDataType( match[2] );
          break;
        }
      }
    }
    var dataValue = null;
    var hiddenField = document.getElementById( elm.id + '-hidden' );
    if( hiddenField && hiddenField.value ) {
      dataValue = JSON.parse( hiddenField.value );
      dataValue = dv.newDataValue( dataValue.type, dataValue.value );
    }
    var valueview = valueViewBuilder.initValueView( $elm, dataType, dataValue, propertyId );
    valueview.startEditing();
    $elm.on( 'valueviewchange', function() {
      var value = valueview.value();
      hiddenField.value = JSON.stringify( { type: value.getType(), value: value.toJSON() } );
    } );
  } );
}(
  dataValues,
	jQuery,
	mediaWiki,
	wikibase,
	wikibase.dataTypeStore,
	wikibase.experts.getStore,
	wikibase.parsers.getStore
) );
