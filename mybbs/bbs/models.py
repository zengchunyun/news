from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
import datetime

# Create your models here.


class Article(models.Model):
    title = models.CharField(max_length=255, verbose_name=u'文章标题')
    brief = models.CharField(null=True, blank=True, max_length=255, verbose_name=u'简介')
    category = models.ForeignKey('Category', verbose_name=u'版块')
    content = models.TextField(verbose_name=u'文章内容')
    author = models.ForeignKey('UserProfile', verbose_name=u'发布者')
    pub_date = models.DateTimeField(blank=True, null=True, verbose_name=u'发布日期')
    last_modify = models.DateTimeField(auto_now=True)  # 每次修改自动更新时间
    priority = models.IntegerField(verbose_name=u'优先级', default=1000)
    head_img = models.ImageField(verbose_name=u'文章标题图片', upload_to='uploads')
    status_choices = (
        ('draft', u'草稿'),
        ('published', u'已发布'),
        ('hidden', u'隐藏'),
    )
    status = models.CharField(choices=status_choices, default='published', max_length=32, verbose_name=u'状态')

    def __str__(self):
        return self.title

    def clean(self):
        if self.status == 'draft' and self.pub_date is not None:
            raise ValidationError('Draft entries may not have a publication date .')
        if self.status == 'published' and self.pub_date is None:
            self.pub_date = datetime.date.today()

    class Meta:
        verbose_name = u'文章'
        verbose_name_plural = u'文章'


class Comment(models.Model):
    article = models.ForeignKey('Article', verbose_name=u"所属文章")
    parent_comment = models.ForeignKey('self', related_name='my_children', blank=True, null=True, verbose_name=u'父级评论')
    comment_choices = (
        (1, u'评论'),
        (2, u"点赞"),
    )
    comment_type = models.IntegerField(choices=comment_choices, default=1, verbose_name=u'评论类型')
    user = models.ForeignKey("UserProfile", verbose_name=u'发布者')
    comment = models.TextField(blank=True, null=True, verbose_name=u'内容')
    date = models.DateTimeField(auto_now_add=True, verbose_name=u'发布时间')

    def clean(self):
        if self.comment_type == 1 and len(self.comment) == 0:
            raise ValidationError(u'评论内容不能为空')

    def __str__(self):
        return "内容ID:%s 父级ID:%s" % (self.id, self.parent_comment_id)

    class Meta:
        verbose_name = u'评论'
        verbose_name_plural = u'评论'


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True, verbose_name=u'版块名称')
    brief = models.CharField(null=True, blank=True, max_length=255, verbose_name=u'版块简介')
    set_as_top_menu = models.BooleanField(default=False, verbose_name=u'是否置顶显示')
    position_index = models.SmallIntegerField(verbose_name=u'导航栏权重')
    admins = models.ManyToManyField('UserProfile', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = u'版块'
        verbose_name_plural = u'版块'


class UserProfile(models.Model):
    user = models.OneToOneField(User, verbose_name=u'用户名')
    name = models.CharField(max_length=32, verbose_name=u'昵称')
    signature = models.CharField(max_length=255, blank=True, null=True, verbose_name=u'签名')
    head_img = models.ImageField(
        blank=True, null=True, verbose_name=u'头像', upload_to='uploads')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = u'用户'
        verbose_name_plural = u'用户'
