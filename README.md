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

			// submit from and get response
	formUtilities.submitFormViaAjax($form, {urlParams: 'ajax=1'}).done(function(response) {
		// use response from ajax request
	});
});

```