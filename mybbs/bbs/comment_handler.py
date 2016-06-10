#!/usr/bin/env python
# encoding:utf8
from collections import OrderedDict
import datetime


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


def node_tree(comment, tree):
    # print(comment, tree)
    if comment.parent_comment is None:  # 找到父亲
        tree[comment] = {}  # 把父亲对象作为key存储字典
    else:
        # print(comment.parent_comment, '------', comment)
        for parent, child in tree.items():
            # print('parent: ', parent, '-----------------', 'child: ', child)
            if parent == comment.parent_comment:  # 找到子树父亲
                # print('找到了 !!!')
                tree[comment.parent_comment][comment] = {}  # 建立子树KEY
            else:
                # print("继续找下一个 ...")
                node_tree(comment, child)  # 如果找不到,就继续找


def render_tree_node(tree, margin_val):
    html = ""
    for k, v in tree.items():
        if k.comment_type == 2:
            continue
        ele = "<div class='comment-node' style='margin-left:%spx' username='%s' commentid='%s'>" % (margin_val, k.user.name, k.id) + \
              "<span style='margin-left:20px'><img src='/static/%s' width=19 height=19> %s</span>" % (
                  str(k.user.head_img.name).split('/', maxsplit=1)[-1], k.user.name) + \
              "<span style='margin-left:20px'>%s</span>" % diff_time(k.date) + \
            '<span class="glyphicon glyphicon-comment" style="color:#5cb85c" comment="%s' % k.id+'"> </span>' +\
              "<span style='margin-left:20px'>%s</span>" % k.comment + \
              "</div>"
        html += ele
        html += render_tree_node(v, margin_val+20)
    return html


def render_commnet_tree(tree):
    html = ''
    for k, v in tree.items():
        if k.comment_type == 2:
            continue
        ele = "<div class='root-commnet' username='%s' commentid='%s'>" % (k.user.name, k.id) + \
              "<span style='margin-left:20px'><img src='/static/%s' width=19 height=19> %s</span>" % (
                  str(k.user.head_img.name).split('/', maxsplit=1)[-1], k.user.name) + \
              "<span style='margin-left:20px'>%s</span>" % diff_time(k.date) + \
              '<span class="glyphicon glyphicon-comment" style="color:#5cb85c" comment="%s' % k.id + '"> </span>' + \
              "<span style='margin-left:20px'>%s</span>" % k.comment + \
              "</div>"
        html += ele
        html += render_tree_node(v, 20)
    return html


def build_tree(comment_obj):
    tree = OrderedDict()
    for comment in comment_obj:
        node_tree(comment, tree)
    return tree
