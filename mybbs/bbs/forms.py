#!/usr/bin/env python
# encoding:utf8

from django import forms
from bbs import models


class ArticleForm(forms.ModelForm):
    class Meta:
        model = models.Article
        exclude = ('author',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_name in self.base_fields:
            field = self.base_fields[field_name]
            field.widget.attrs.update({'class': 'form-control'})
