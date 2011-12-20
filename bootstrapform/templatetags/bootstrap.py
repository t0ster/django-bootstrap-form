from django.template import Context
from django.template.loader import get_template
from django import template

register = template.Library()

@register.filter
def bootstrap(form):
    template = get_template("bootstrapform/form.html")
    context = Context({'form': form})
    return template.render(context)

@register.filter
def bootstrapformset(formset):
    template = get_template("bootstrapform/formset.html")
    context = Context({'formset': formset})
    return template.render(context)

field_templates = {
    'radioselect': 'multiple_input',
    'checkboxselectmultiple': 'multiple_input',
    'checkboxinput': 'checkbox_input',
}

def get_field_type(field):
    return field.field.widget.__class__.__name__.lower()

def get_field_template(field):
    field_type = get_field_type(field)
    template_name = field_templates.get(field_type, 'generic')
    return get_template('bootstrapform/fields/%s.html' % template_name)

@register.filter
def bootstrapfield(field):
    template = get_field_template(field)
    context = Context({'field': field})
    return template.render(context)

