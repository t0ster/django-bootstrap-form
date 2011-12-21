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
		
		var INITIAL_FORMS = context.find('[name$=-INITIAL_FORMS]');
		var TOTAL_FORMS = context.find('[name$=-TOTAL_FORMS]');
		var MAX_NUM_FORMS = context.find('[name$=-MAX_NUM_FORMS]');
		
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
		
		var set_add_control_state = function () {
			context.find('.formset-control-add').each(function () {
				var $this = $(this);
				var form_count = forms().size();
				if (form_count >= parseInt(MAX_NUM_FORMS.val())) {
					$this.attr('disabled', 'disabled');
				} else {
					$this.removeAttr('disabled');
				}
			});
		};
		
		var set_move_up_control_state = function () {
			context.find('.form-control-move-up').each(function () {
				var $this = $(this);
				var form = $this.parents('.formset-form');
				var index = parseInt(form.find('[name$=ORDER]').val());
				if (index == 0) {
					$this.attr('disabled', 'disabled');
				} else {
					$this.removeAttr('disabled');
				}
			});
		};
		
		var set_move_down_control_state = function () {
			var total = parseInt(TOTAL_FORMS.val());
			context.find('.form-control-move-down').each(function () {
				var $this = $(this);
				var form = $this.parents('.formset-form');
				var index = parseInt(form.find('[name$=ORDER]').val());
				if (index >= (total - 1)) {
					$this.attr('disabled', 'disabled');
				} else {
					$this.removeAttr('disabled');
				}
			});
		};
		
		var update_button_states = function () {
			set_add_control_state();
			set_move_up_control_state();
			set_move_down_control_state();	
		};
		
		context.find('.formset-control-add').click(function () {
			var lastform = context.find('.formset-form:last');
			clone().hide().insertAfter(lastform).fadeIn();
			update_button_states();
			return false;
		});
		
		context.on('click', '.form-control-remove', function () {
			var $this = $(this);
			var form = $this.parents('.formset-form');
			var del = form.find('[name$=DELETE]');
			var button_state = $this.hasClass('active');
			if (button_state) {
				$this.button('toggle');
				$this.button('reset');
				$this.attr('title', 'remove');
				del.removeAttr('checked');
				form.find(':input').removeAttr('disabled');
			} else {
				$this.button('toggle');
				$this.button('toggled');
				$this.attr('title', 'undo');
				del.attr('checked', 'checked');
				form.find(':input').not($this).not(del).attr('disabled', 'disabled');
			}
			update_button_states();
			return false;
		});
		
		var reorderer = function (offset) {
			return function () {
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
			
				var $this = $(this);
				var form = $this.parents('.formset-form');
				var formset = $this.parents('.formset');
				var order = form.find('[name$=ORDER]');
				var index = parseInt(order.val());
				reorderforms(form, index + offset);
				update_button_states();			
				return false;
			};
		}
		
		context.on('click', '.form-control-move-up', reorderer(-1));
		context.on('click', '.form-control-move-down', reorderer(1));
		
		context.find('[name$=DELETE]').parents('.clearfix').hide();
		context.find('[name$=ORDER]').each(function () {
			var $this = $(this);
			if ($this.val() == '') {
				$this.val('0');
			}
		});
		// context.find('[name$=ORDER]').parents('.clearfix').hide();
		set_add_control_state();
		set_move_up_control_state();
		set_move_down_control_state();				
	});
})( window.jQuery || window.ender );
