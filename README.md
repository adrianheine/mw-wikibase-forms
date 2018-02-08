
`LocalSettings.php`:

```php

// Set up namespace
define("NS_WB_FORM", 100);
define("NS_WB_FORM_TALK", 101);

$wgExtraNamespaces[NS_WB_FORM] = "WikibaseForm";
$wgExtraNamespaces[NS_WB_FORM_TALK] = "WikibaseForm_talk";

$wgNamespaceProtection[NS_WB_FORM] = array( 'editwbform' );
$wgGroupPermissions['sysop']['editwbform'] = true;

$wgWikibaseFormsNamespace = NS_WB_FORM;

wfLoadExtension( 'wikibase-forms' );

```
