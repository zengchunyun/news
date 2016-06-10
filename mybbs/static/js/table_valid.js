/**
 * Created by zengchunyun on 16/5/30.
 */
function Choices(ths) {
    $(ths).addClass("active").siblings().removeClass("active");  //为当前触发点击的按钮添加活动样式,去除兄弟活动样式
    switch ($(ths).attr("action")){
        case "select-all": //全选
            SelectAll("input[check='true']");  //传入需要选择的标签元素列表,
            break;
        case "unselect-all": //取消选中
            UnSelect("input[check='true']");  //传入需要取消选择的标签元素
            break;
        case "reverse-all": //反选
            ReverseAll("input[check='true']");  //传入需要反选的标签元素
            break;
        case "add-col": //添加操作
            break;
        case "del-col": //删除操作
            var getData = DelMode("#show-data-info");  //需要操作的table表元素
            getData["action"] = "delete";  //添加元素,用于告知后台当前操作类型是什么
            Delete(getData);
            break;
        case "each-mo": //批量修改
            ErrorMsg("功能未实现");  //错误信息展示,参数为字符串消息
            break;
        case "each-edit":  //批量编辑
            // ErrorMsg("数据提交未完善");
            EachEditMode(ths);
            break;
        case "one-row-edit":  //单行编辑
            OneEdit(ths);
            break;
    }
}

function Delete(del_data) {
    var del_len = del_data['del'].length;  //获取字典对象长度,该对象为数组,所以这里获取这个对象的数组的个数
    swal(
        {   title: "Are you sure?",
            text: "You will not be able to recover this imaginary data!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        function(){
            var url = window.location.href; //获取当前URL
            if(del_len > 0){
                AjaxSubmit(url, del_data);  //将数据通过AJAX提交,参数,URL,提交的数据请求
                var get_ret = false;
                setTimeout(function(){
                    get_ret = $("#show-ret").hasClass("invisible");  //判断是否有错误提示,有错误提示则不会出现该css类
                    if(get_ret){
                        swal("Deleted!", "You has been deleted " + del_len+ " record.", "success");
                        for(var index in del_data['del']){
                            $("#show-data-info").find(":checkbox").each(function () {
                                if(String($(this).val()) == String(del_data['del'][index])){
                                    $(this).parents("tr").remove();  //同时页面移除该对象
                                }
                            });
                        }
                    }else {
                        swal("Failed!", "", "error");
                    }
                }, 500);

            }
        });
}


//获取cookies
function getCookie(name) {
    var cookieValue = null;
    if(document.cookie && document.cookie != ''){
        var cookie = document.cookie.split(';');
        for(var i = 0;i<cookie.length;i++){
            var cookie = jQuery.trim(cookie[i]);
            if(cookie.substring(0,name.length + 1) == (name + '=')){
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));  //判断请求是否在这些请求内
}
function AjaxSubmit(url,data) {  //ajax发送数据,第一个参数为需要提交到哪个URL,第二个参数为数据,数据最终以json字符串发送,后台需要反序列化
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        url: url,
        type: 'POST',
        beforeSend:function (xhr, settings) {
          if(!csrfSafeMethod(settings.type)&&!this.crossDomain){
              xhr.setRequestHeader("X-CSRFToken",csrftoken);
          }
        },
        traditional:true,
        data:{data:JSON.stringify(data)},  //序列化数据为JSON格式
        success:function (arg) {
            try {
                var getData = $.parseJSON(arg);  //获取返回值
                var status = getData.status;  //尝试获取返回状态,改字段由后台定义
                var errorMsg = getData.error;  //尝试获取返回数据,不一定是错误消息,按情况而定,一般有status,且为false时,才可能是错误消息
                if(typeof errorMsg == "string" && errorMsg.length > 0){
                    ErrorMsg(errorMsg);  //对返回的消息进行操作处理
                }else {
                    console.log(status, errorMsg);
                }
            }catch (errmsg){
                ErrorMsg("删除失败");
                console.log("json error?" + errmsg);
            }
        },
        error:function (arg) {
            ErrorMsg(arg.statusText);
            // console.log(arg)
        }
    });
}
function SelectAll(checkbox_list) {
    $(checkbox_list).each(function () {
        if(!$(this).prop("checked")){
            $(this).prop("checked",true);
        }
        ClickEvent("[action='each-edit']",this,"#show-data-info");  //传入三个参数,是否进入编辑模式,当前触发按钮对象,操作的table
    })
}
function UnSelect(checkbox_list) {
    $(checkbox_list).each(function () {
        $(this).prop("checked",false);
        ClickEvent("[action='each-edit']",this,"#show-data-info");
    })
}
function ReverseAll(checkbox_list) {
    $(checkbox_list).each(function () {
        $(this).prop("checked",!$(this).prop("checked"));
        ClickEvent("[action='each-edit']",this,"#show-data-info");
    })
}
function OneEdit(ths) {
    var dataDic = {};  //定义ajax返回数据对象
    var data = [];  //存放已修改字典数据对象
    var $tr = $(ths).parents('tr');
    var $td = $tr.find('td');
    var button_html = $(ths).children("span :first");
    if($(ths).prop("edit")){
        $(ths).html(button_html).append(" 编辑").css("color",'#fff').prop("edit",false);
        var getData = SaveMode($td);
        var url = window.location.href; //获取当前URL
        if(typeof getData != "undefined"){
            data.push(getData);
            dataDic['action'] = 'update';  //定义当前ajax操作
            dataDic['data'] = data;  //将数据绑定
            AjaxSubmit(url,dataDic);//提交更新的数据信息
        }
    }else {
        $(ths).html(button_html).append(" 保存").css("color",'yellow').prop("edit",true);
        EditMode($td);
        BindEvent($td);
    }
}

function EachEditMode(ths) {
    var button_html = $(ths).children();
    if($(ths).prop("edit")){
        $(ths).html(button_html).append(" 编辑模式").css("color",'#fff').prop("edit",false);
        EachSave("#show-data-info");  //参数为table元素
    }else {
        $(ths).html(button_html).append(" 全部保存").css("color",'yellow').prop("edit",true);
        EachEdit("#show-data-info");  //参数为table元素
    }
}
//给每个文本标签绑定change事件
function BindEvent($td) {
    $td.each(function () {
        $(this).children(":text,select").on('change',function () {
            $(this).attr("has_edited","true")
        });
    });
}
//将已修改的字段返回
function SaveMode($td) {
    var data = {};
    var update = false;
    $td.each(function () {
        var edit_status = $(this).attr('edit'); // 处理含有编辑属性的标签
        var getId = $(this).siblings().find(":checkbox").val();
        if(edit_status == "true"){
            if(getId){
                data["id"] = getId;
            }
            if($(this).prop("edit-now")){
                var getFirst = $(this).children(":first");
                var before = getFirst.val();
                if(getFirst.attr("has_edited") == "true"){
                    var name = getFirst.attr("name");
                    data[name] = before;
                    update = true;
                }
                if($(this).attr("edit-type")=='text'){  //input输入标签
                    $(this).html(before);
                }else if($(this).attr('edit-type')=='select_group'){  //选择标签
                    $(this).html(before);
                }else if($(this).attr('edit-type')=='select_status'){
                    $(this).html(before);
                }
            }
            $(this).prop("edit-now",false);
        }
    });
    if(update){
        return data;
    }

}
//获取表单的name属性
function GetName() {
    var getName = [];
    $("#add-host").find(":text").each(function () {
        getName.push($(this).attr("name"));
    });
    return getName;
}

function EditMode($td) {
    $td.each(function () {
        var edit_status = $(this).attr('edit');
        if(edit_status == "true"){
            if(!$(this).prop("edit-now")){
                var before = $(this).text();
                if($(this).attr('edit-type')=='text'){
                    $(this).html("<input name='" + $(this).attr("name") +"' type='text' value='" + before + "'>").children().addClass('col-md-10 col-sm-8')
                }
            }
            $(this).prop("edit-now",true);
        }
    });
}


//删除模式
function DelMode(tb) { //参数为table元素对象
    var data = {};//定义一个空字典存放删除的数据,用于后台提交
    var getName = GetName()[0];
    getName = 'del';  //将所有删除对象存放到del key里
    data[getName] = [];
    $(tb).find(":checkbox").each(function () {
        var isChecked = $(this).prop("checked");
        if(isChecked){
            var $td = $(this).parents("td");
            if($td.siblings(":last").find(":button").prop("edit")){
                ErrorMsg("请保存数据再操作!")
            }else {
                var value = $td.find(":checkbox").val();
                data[getName].push(value); //将删除对象添加到列表
                // $td.parent().remove();  //同时页面移除该对象
            }
        }
    });
    return data;//返回被删除的列表
}

//批量编辑
function EachEdit(tb) {
    $(tb).find("tr").each(function () {
        if($(this).find(":checkbox").prop("checked")){
            var $td = $(this).children("td");
            EditMode($td);
            BindEvent($td);
        }
    });
}
//批量保存
function EachSave(tb) {
    var dataDic = {};  //定义ajax返回数据对象
    var data = [];  //存放已修改字典数据对象
    $(tb).find("tr").each(function () {
        if($(this).find(":checkbox").prop("checked")){
            var $td = $(this).children("td");
            var getData = SaveMode($td);  //获取修改的每条数据
            if(typeof getData != "undefined"){
                data.push(getData);  //将数据放入列表
            }
        }
    });
    if(data.length > 0){
        dataDic['action'] = 'update';  //定义当前ajax操作
        dataDic['data'] = data;  //将数据绑定
        var url = window.location.href; //获取当前URL
        AjaxSubmit(url,dataDic);//提交更新的数据信息
    }
}

function ClickEvent(edit_btn,check_btn,table_name) {
    if($(edit_btn).prop("edit")){
            if($(check_btn).prop("checked")){
                EachEdit(table_name);
            }else {
                var $td = $(check_btn).parents("td").siblings();
                var getData = SaveMode($td);
                getData["action"] = "update";
                var url = window.location.href; //获取当前URL
                AjaxSubmit(url,getData);//提交更新的数据信息
            }
        }
}

function ErrorMsg(message) {
    var show_ele = "#show-ret"; //设置需要在哪个元素上显示信息
    $(show_ele).text(message);
    $(show_ele).removeClass('invisible');
    setTimeout('$("#show-ret").addClass("invisible");',6000);
}

(function ($) {
    $('[data-toggle="tooltip"]').each(function () {
        $(this).hover(function () {
            $(this).tooltip();  //显示小提示
        },function () {
            $(this).tooltip('hide');  //关闭小提示
        })
    });
    //点击提交前发送ajax后台校验
    $('[add-row="true"]').click(function () {
        var data = {};
        $("#add-host :text").each(function () {
            var name = this.name;
            var value = $(this).val();
            data[name] = value;
        });
        var url = window.location.href; //获取当前URL
        AjaxSubmit(url,data);
        if($(this).attr("data-valid") == "true"){
            $("#add-host").submit();
        }else {
                return false
        }
    });
    //每次输入都后台校验
    $("#add-host :text").on('blur',function () {
        var data = {};
        var name = this.name;
        var value = $(this).val();
        data[name] = value;
        var url = window.location.href; //获取当前URL
        AjaxSubmit(url,data);
    });
    //针对添加操作触发的提示事件
    $(document).ready(function () {
        if($("#show-ret").text()){
            $("#show-ret").removeClass('invisible');
            setTimeout('$("#show-ret").addClass("invisible");',6000);
        }else {
            $("#show-ret").addClass('invisible');
        }
    });

    //点击选中按钮触发事件
    $("table :checkbox").on("click",function () {
        ClickEvent("[action='each-edit']",this,"#show-data-info"); //第一个参数编辑模式元素,checkbox元素,table元素
    });
    //处理所有的button点击事件
    $(":button").click(function () {
        Choices(this)
    });
    $("#add-data").find("label").next().addClass("form-control");//为表单添加样式
    //该功能用于指定显示列
    $(":checkbox[name='show_item']").on("change", function () {
        var get_text = $.trim($(this).parent("label").text());
        var get_val = $(this).val();
        $("#show-data-info").find("th").each(function () {
            var get_th_text = $.trim($(this).text());
            if(get_text == get_th_text){
                $(this).toggleClass("hide");
            }
        });
        $("#show-data-info").find('td').each(function () {
            var get_td_name = $(this).attr("name");
            if(get_val == get_td_name){
                $(this).toggleClass("hide")
            }
        });
    });

})(jQuery);