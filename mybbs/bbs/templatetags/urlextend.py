#!/usr/bin/env python
# encoding:utf8

from django.template import Library
from collections import Counter
import datetime


register = Library()


@register.filter
def show_img(img_obj):
    return str(img_obj.name).split('/', maxsplit=1)[-1]


@register.simple_tag
def resolve_comment(article_obj):
    reduce_list = article_obj.comment_set.select_related().all().values('comment_type')
    comment_types = list(Counter([str(list(new_dict.values())[0]) for new_dict in reduce_list]).items())
    return dict(comment_types)


# @register.simple_tag
# def show_comment(article_obj):
#     # print(article_obj.comment_set.select_related())
#     return


@register.filter
def diff_time(timedate):
    show_time = []
    current_datetime = datetime.datetime.now()
    diff_datetime = current_datetime - timedate.replace(tzinfo=None)
    total_seconds = diff_datetime.total_seconds()  # 将时间转换为秒数
    if total_seconds >= 86400:
        before_datetime = int(divmod(total_seconds, 86400)[0])
        show_time.append(u"%s天" % before_datetime)
        total_seconds -= 86400 * before_datetime
    if total_seconds >= 3600:
        before_datetime = int(divmod(total_seconds, 3600)[0])
        show_time.append(u"%s小时" % before_datetime)
        total_seconds -= 3600 * before_datetime
    if total_seconds >= 60:
        before_datetime = int(divmod(total_seconds, 60)[0])
        show_time.append(u"%s分钟" % before_datetime)
        total_seconds -= 60 * before_datetime
    if not show_time:
        show_time.append(u'%s秒' % int(total_seconds))
    show_time = u"%s前" % ''.join(show_time[:2])
    return show_time
