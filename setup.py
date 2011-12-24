from setuptools import setup, find_packages
from bootstrapform.meta import VERSION


setup(name='django-bootstrap-form',
    author='tzangms', author_email='tzangms@gmail.com',
    version=str(VERSION),
    packages=find_packages(),
    include_package_data=True,
)
