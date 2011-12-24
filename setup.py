from setuptools import setup, find_packages
from bootstrapform.meta import VERSION


setup(name='django-bootstrap-form',
    author='tzangms', author_email='tzangms@gmail.com',
    url='https://github.com/t0ster/django-bootstrap-form',
    version=str(VERSION),
    packages=find_packages(),
    include_package_data=True,
)
