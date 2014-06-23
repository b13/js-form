/**!
 *  Module to submit a form via ajax and do a basic validation
 *
 *  Author: Daniel Sattler
 *  © 2014 b:dreizehn GmbH, Stuttgart
 */


define([
	"jquery"
], function($) {

	var form = function() {

		var me = this;

			// init function
		function initialize() {
			return me;
		}


			/**
			 * validate form
			 * check all form fields with the class="bJS_required" if the have an input
			 *
			 * the following field type's will be checked:
			 * 	- input type="text"     : is not empty
			 *  - input type="checkbox" : is checked
			 *  - input type="email"    : email is valid
			 *
			 * @$form jquery DOM reference to the form that needs to be checked
			 *
			 * @return true || false
			 */
		me.validateForm = function($form) {

			var
				isValid = true
				, errorClassName = "b_error";

			$form.find('.bJS_required').each(function() {
				var type = $(this).attr('type');

				$(this).removeClass(errorClassName);
				if ($(this).hasClass('bJS_numberformat')) {
					var regEx = /[0-9 -()+-\.]+$/;

					if ($(this).val().length === 0 || regEx.test($(this).val()) == false) {
						$(this).addClass(errorClassName);
						isValid = false;
					}
				} else {
					switch (type) {
						case "text":
							if ($(this).val().length === 0) {
								$(this).addClass(errorClassName);
								isValid = false;
							}
							break;
						case "checkbox":
							if (!$(this).is(':checked')) {
								$(this).addClass(errorClassName);
								isValid = false;
							}
							break;
						case "email":
							var regEx = /\S+@\S+\.\S+/;

							if ($(this).val().length === 0 || regEx.test($(this).val()) == false) {
								$(this).addClass(errorClassName);
								isValid = false;
							}
							break;
						case "number":
							var regEx = /[0-9 -()+-\.]+$/;

							if ($(this).val().length === 0 || regEx.test($(this).val()) == false) {
								$(this).addClass(errorClassName);
								isValid = false;
							}
							break;
					}
				}

				if ($(this)[0].nodeName === "SELECT") {
					if ($(this).val() == 'disabled' || $(this).val() === null) {
						$(this).addClass(errorClassName);
						isValid = false;
					}
				}
				if ($(this)[0].nodeName === "TEXTAREA") {
					if ($(this).val().length === 0) {
						$(this).addClass(errorClassName);
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