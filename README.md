js-form
=======

Module to submit forms via ajax and do a basic form validation

# requireJS config

```js
var require = {
	paths: {
		'form' : 'path/to/form'
	}
};
```

# Basic usage

```js
require(['form'], function(form) {

	var formUtilities = new form();

		// check if the form is valid
	formUtilities.validateForm($form);

		// submit form via ajax and return response as jquery promise
	formUtilities.submitFormViaAjax($form, {urlParams: 'ajax=1'}).done(function(response) {
		// use response from ajax request
	});

		// submit form with a attachment via ajax and return the response as jquery promise
	formUtilities.submitFormWithAttachmentViaAjax($form, {urlParams: 'ajax=1'}).done(function(response) {
		// use response from ajax request
	});
});

```