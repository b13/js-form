/**!
 *  Module to submit a form via ajax and do a basic validation
 *
 *  Author: Daniel Sattler
 *  © 2014 b:dreizehn GmbH, Stuttgart
 */


define([
	"jquery"
], function($) {

		// default options
	var options = {
		errorClassName          : 'error'
		, requiredFieldSelector : '[data-required="true"]'
	};

	var form = function(opts) {

		var
			me = this
			,s = $.extend(options, opts);

			// init function
		function initialize() {
			return me;
		}

			/**
			 * validate all form fields which match with the s.requiredFieldSelector selector
			 *
			 * validate field for:
			 * 	- input type="text"     : not empty
			 * 	- select                : not empty
			 * 	- textarea              : not empty
			 *  - input type="checkbox" : is checked
			 *  - input type="email"    : email is valid
			 *
			 * @$form jquery DOM reference to the form that needs to be checked
			 * @return true || false
			 */
		me.validateForm = function($form) {
			var isValid = true;

			$form.find(s.requiredFieldSelector).each(function() {
				var type = $(this).attr('type');

				$(this).removeClass(s.errorClassName);

				switch (type) {
					case "text":
						if ($(this).val().length === 0) {
							$(this).addClass(s.errorClassName);
							isValid = false;
						}
					break;
					case "checkbox":
						if (!$(this).is(':checked')) {
							$(this).addClass(s.errorClassName);
							isValid = false;
						}
					break;
					case "radio":
						$form.find('[name="' + $(this).attr("name") + '"]').removeClass(s.errorClassName);
						if (!$form.find('[name="' + $(this).attr("name") + '"]').is(':checked')) {
							$(this).addClass(s.errorClassName);
							isValid = false;
						}
					break;
					case "email":
						var regEx = /\S+@\S+\.\S+/;
						if ($(this).val().length === 0 || regEx.test($(this).val()) == false) {
							$(this).addClass(s.errorClassName);
							isValid = false;
						}
					break;
					case "number":
						var regEx = /[0-9 -()+-\.]+$/;

						if ($(this).val().length === 0 || regEx.test($(this).val()) == false) {
							$(this).addClass(s.errorClassName);
							isValid = false;
						}
					break;
				}

				if ($(this)[0].nodeName === "SELECT") {
					if ($(this).val() == 'disabled' || $(this).val() === null) {
						$(this).addClass(s.errorClassName);
						isValid = false;
					}
				}
				if ($(this)[0].nodeName === "TEXTAREA") {
					if ($(this).val().length === 0) {
						$(this).addClass(s.errorClassName);
						isValid = false;
					}
				}
			});

			return isValid;
		};


			/**
			 * submit form via ajax and return response as jquery promise
			 *
			 * @param {form jQuery selector} $form
			 * @param {object} [opts]
			 * @returns {promise object} jQuery promise
			 */
		me.submitFormViaAjax = function($form, opts) {

			var opts = $.extend({
					type        : $form.attr('method').toLowerCase() === "post" ? 'post' : 'get'
					, cache     : false
					, urlParams : ""
				}, (typeof opts === 'undefined' ? {} : opts ));

			return $.ajax({
				url        : $form.attr('action')
				, type     : opts.type
				, cache    : opts.cache
				, dataType : "html"
				, data     : $form.serialize() + (opts.urlParams.length > 0 ? "&" + opts.urlParams : "" )
			}).promise();
		};


			/**
			 * submit form with a attachment via ajax and return the response as jquery promise
			 *
			 * @param {form jQuery selector} $form
			 * @param {object} [opts]
			 *
			 * @returns {promise object} jQuery promise
			 */
		me.submitFormWithAttachmentViaAjax = function($form, opts) {

			if (!window.FormData) {
				console.log('FormData not available! include "html5-formdata": https://github.com/francois2metz/html5-formdata');
				return false;
			}

			var formData = new FormData($($form)[0]);

			var opts = $.extend({
					type          : $form.attr('method').toLowerCase() === "post" ? 'post' : 'get'
					, cache       : false
					, urlParams   : ""
				}, (typeof opts === 'undefined' ? {} : opts ));


			return $.ajax({
				url           : $form.attr('action')
				, type        : opts.type
				, processData : false
      			, contentType : false
				, data        :  formData
			}).promise();
		};

		initialize();
	};

	return form;
});