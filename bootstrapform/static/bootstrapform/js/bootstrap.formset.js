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
        
        var order_field = function (form) {
            return form.find('[name$=-ORDER]');
        };
        
        var delete_field = function (form) {
            return form.find('[name$=-DELETE]');
        };
        
        var clone = function (lastform) {
            var total = TOTAL_FORMS.val();
            var new_element = lastform.clone(true);
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
            order_field(new_element).val(total);
            total++;
            TOTAL_FORMS.val(total);
            return new_element;
        };
        
        order_field(context).each(function () {
            var $this = $(this).hide();
            var cell = $this.parents('td');
            var buttons = $('<button class="form-control-move-up btn small" title="move up">⬆</button><button class="form-control-move-down btn small" title="move down">⬇</button>');
            cell.append(buttons);
        });
        
        delete_field(context).each(function () {
            var $this = $(this).hide();
            var cell = $this.parents('td');
            var button = $('<button class="form-control-remove btn small danger" title="remove" data-toggled-text="⟲">╳</button>');
            cell.append(button);
        });
        
        var num_cols = context.find('thead tr').children().length;
        var add_button_row = $('<tr><td colspan="'+ num_cols +'"><button class="formset-control-add btn small" title="add item">add item</button></td></tr>');
        context.find('tbody').append(add_button_row);
        
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
                var index = parseInt(order_field(form).val());
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
                var index = parseInt(order_field(form).val());
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
            clone(lastform).hide().insertAfter(lastform).fadeIn();
            update_button_states();
            return false;
        });
        
        context.on('click', '.form-control-remove', function () {
            var $this = $(this);
            var form = $this.parents('.formset-form');
            var del = delete_field(form);
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
                var $this = $(this);
                var form = $this.parents('.formset-form');
                var tbody = $this.parents('tbody');
                var formset = $this.parents('.formset');
                
                var allforms = $.makeArray(forms());
                var position = 0;
                $.each(allforms, function (i) {
                    if (this == form[0]) {
                        position = i;
                    }
                });
                
                allforms.splice(position, 1);
                allforms.splice(position + offset, 0, form[0]);
                
                $.each(allforms, function (i) {
                    order_field($(this)).val(i);
                });
                
                tbody.append(allforms).append(context.find('.formset-control-add').parents('tr'));
                
                update_button_states();
                return false;
            };
        }
        
        context.on('click', '.form-control-move-up', reorderer(-1));
        context.on('click', '.form-control-move-down', reorderer(1));
        
        order_field(context).each(function () {
            var $this = $(this);
            if ($this.val() == '') {
                $this.val('0');
            }
        });
        
        update_button_states();
    });
})( window.jQuery || window.ender );
