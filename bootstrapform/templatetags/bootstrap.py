import collections

from django.template import Context
from django.template.loader import get_template
from django import template
from django.utils.encoding import force_unicode
from django.forms.widgets import CheckboxInput, CheckboxSelectMultiple
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def bootstrap(form):
    template = get_template("bootstrapform/form.html")
    context = Context({'form': form})
    return template.render(context)


@register.filter
def is_checkbox(field):
    return isinstance(field.field.widget, (CheckboxInput, CheckboxSelectMultiple))


@register.filter
def checkbox_inputs(field):
    if isinstance(field.field.widget, CheckboxInput):
        return [mark_safe(u'<label>%s<span>%s</span></label>' % (field, field.label))]
    name = field.name
    value = field.value()
    attrs = field.field.widget.attrs
    choices = field.field.choices

    if value is None:
        value = []
    has_id = attrs and 'id' in attrs
    final_attrs = attrs.copy()
    final_attrs.update({'name': name})
    # Normalize to strings
    str_values = set([force_unicode(v) for v in value])
    checkbox_inputs = []
    disabled_list = []
    if isinstance(final_attrs.get('disabled'), collections.Iterable):
        disabled_list = final_attrs.pop('disabled')
    for i, (option_value, option_label) in enumerate(choices):
        _final_attrs = final_attrs.copy()
        # If an ID attribute was given, add a numeric index as a suffix,
        # so that the checkboxes don't all have the same ID attribute.
        if has_id:
            _final_attrs = dict(_final_attrs, id='%s_%s' % (final_attrs['id'], i))
        if option_value in disabled_list:
            _final_attrs.update({'disabled': True})

        cb = CheckboxInput(_final_attrs, check_test=lambda value: value in str_values)
        option_value = force_unicode(option_value)
        rendered_cb = cb.render(name, option_value)
        checkbox_inputs.append(mark_safe(
            u'<label>%s<span>%s</span></label>' % (rendered_cb, option_label)
        ))
    return checkbox_inputs
