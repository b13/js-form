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
						if (!$form.find('[name="' + $(this).attr(name) + '"]').is(':checked')) {
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
			 * submit a from via ajax and return response as promise
			 * @param {form jQuery selector} $form
			 * @param {object} [opts]
			 * @returns {promise object} jQuery promise
			 */
		me.submitFormViaAjax = function($form, opts) {

			var
				dfd    = new jQuery.Deferred()
				, opts = $.extend({
					type        : $form.attr('method').toLowerCase() === "post" ? 'post' : 'get'
					, cache     : false
					, urlParams : ""
				}, (typeof opts === 'undefined' ? {} : opts ));

			$.ajax({
				url        : $form.attr('action')
				, type     : opts.type
				, cache    : opts.cache
				, dataType : "html"
				, data     : $form.serialize() + (opts.urlParams.length > 0 ? "&" + opts.urlParams : "" )
				, success  : function(response) {
					dfd.resolve(response);
				}
				, error   : function(jqXHR, textStatus) {
					dfd.reject([jqXHR, textStatus]);
				}
			});

			return dfd.promise();
		};

		initialize();
	};

	return form;
});