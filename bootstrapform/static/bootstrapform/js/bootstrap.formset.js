(function ($) {
	"use strict"
	
	var form_name_re = /id_(.+?)-INITIAL_FORMS/;
	$('.formset').each(function () {

		var context = $(this);
		
		var form_name = null;
		context.find('input[type=hidden]').each(function () {
			var id = $(this).attr('id');
			if (id) {
				var m = id.match(form_name_re);
				if (m) {
					form_name = m[1];
				}
			}
		});

		var form_id = function (tail) {
			if (arguments.length < 1) {
				tail = '';
			}
			return '#id_' + form_name + tail;
		};
		
		var TOTAL_FORMS = context.find('[name$=-TOTAL_FORMS]');
		
		var forms = function () {
			return context.find('.formset-form');
		};
		
		var clone = function () {
			var total = TOTAL_FORMS.val();
			var new_element = context.find(form_id('-'+ (total-1) + '-id'))
			                         .parents('.formset-form')
									 .clone(true);
			new_element.find(':input').each(function () {
				var input = $(this);
				var name = input.attr('name');
				if (name) {
					name = name.replace('-' + (total-1) + '-', '-' + total + '-');
					var id = 'id_' + name;
					input.attr({'name': name, 'id': id}).val('').removeAttr('checked');
				}
			});
			new_element.find('label').each(function () {
				var label = $(this);
				var for_ = label.attr('for');
				
				if (for_) {
					var for_ = for_.replace('-' + (total-1) + '-', '-' + total + '-');
					label.attr('for', for_);
				}
			});
			new_element.find('[name$=ORDER]').val(total);
			total++;
			TOTAL_FORMS.val(total);
			return new_element;
		};
		
		context.find('.formset-control-add').each(function () {
			var $this = $(this);
			var fieldset = $this.parents('fieldset');
			$this.click(function () {
				var lastform = context.find('.formset-form:last');
				clone().hide().insertAfter(lastform).fadeIn();
				return false;
			});
		});
		
		context.on('click', '.form-control-remove', function () {
			var $this = $(this);
			var form = $this.parents('.formset-form');
			var del = form.find('[name$=DELETE]');
			del.attr('checked', 'checked');
			form.fadeOut();
			return false;
		});
		
		var reorderforms = function (pivot, position) {
			var other_forms = [],
			    ordered_forms = [];
			forms().each(function () {
				var form = $(this);
				if (form[0] != pivot[0]) {
					var order = form.find('[name$=ORDER]');
					var index = parseInt(order.val());
					other_forms[index] = form;
				}
			});
			$.each(other_forms, function (_, other) {
				if (other) {
					ordered_forms.push(other);
				}
			});
			ordered_forms.splice(position, 0, pivot);
			$.each(ordered_forms, function (i, form) {
				if (form) {
					form.find('[name$=ORDER]').val(i);
				}
			});
		};
		
		context.on('click', '.form-control-move-up', function () {
			var $this = $(this);
			var form = $this.parents('.formset-form');
			var formset = $this.parents('.formset');
			var order = form.find('[name$=ORDER]');
			var index = parseInt(order.val());
			// order.val(--index);
			reorderforms(form, --index);
			return false;
		});
		context.on('click', '.form-control-move-down', function () {
			var $this = $(this);
			var form = $this.parents('.formset-form');
			var formset = $this.parents('.formset');
			var order = form.find('[name$=ORDER]');
			var index = parseInt(order.val());
			// order.val(++index);
			reorderforms(form, ++index);
			return false;			
		});

		context.find('[name$=DELETE]').parents('.clearfix').hide();
		context.find('[name$=ORDER]').each(function () {
			var $this = $(this);
			if ($this.val() == '') {
				$this.val('0');
			}
		});
		// context.find('[name$=ORDER]').parents('.clearfix').hide();		
	});
})( window.jQuery || window.ender );
