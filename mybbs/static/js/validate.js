/**
 * Created by zengchunyun on 16/4/27.
 */
(function (formCheck) {
    formCheck.extend({
        "nameCheck": function (string) {
            var check = /^[a-zA-Z0-9-._@]{4,}$/;
            return check.test(string) ? true : false;
        },
        "ipCheck":function (string) {
            var check = /^(2(5[0-5]|[0-4]\d)|1\d{2}|[1-9]\d|\d)(\.(2(5[0-5]|[0-4]\d)|1\d{2}|[1-9]\d|\d)){3}$/;
            return check.test(string) ? true : false;
        },
        "hostNameCheck": function (string) {
            var check = /^[\w-]$/;
            return check.test(string) ? true : false;
        },
        "portCheck": function (string) {
            var check = /^([1-5](\d{4})|[1-9]\d{0,3}|[1-9]|6([0-4]\d{3}|55([0-2]\d|3[0-5])))$/;
            return check.test(string) ? true : false;
        },
        "phoneCheck": function (string) {
            var check = /^1[3578]\d{9}$/;
            return check.test(string) ? true : false;
        },
        "mailCheck": function (string) {
            var check = /^\w+([-.]\w+)*@\w+([-.]\w+)*\.[a-zA-Z]{2,10}$/;
            return check.test(string) ? true : false;
        },
        "passwordCheck": function (string) {
            var check = /^(?!^\d+$)(?!^[a-zA-Z]+$)(?!^[_#@!$-]+$).{6,20}$/;
            return check.test(string) ? true : false;
        },
        "char-chinese": function (string) {
            var check = /^([\w]|[\u4e00-\u9fa5]|[ 。，、？￥“‘！：【】《》（）——+-])+$/;
            return check.test(string) ? true : false;
        },
        "char-english": function (string) {
            var check = /^([\w]|[ .,?!$'":+-])+$/;
            return check.test(string) ? true : false;
        },
        "dateCheck": function (string) {
            var check = /^(\d{4})-(\d{2})-(\d{2})$/;
            return check.test(string) ? true : false;
        }, 
        "timeCheck": function (string) {
            var check = /^(\d{2}):(\d{2}):(\d{2})$/;
            return check.test(string) ? true : false;
        }, 
        "datetimeCheck": function (string) {
            var check = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
            return check.test(string) ? true : false;
        }, 
        "moneyCheck": function (string) {
            var check = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
            return check.test(string) ? true : false;
        },
        "equalCheck": function (first,second) {
                return first == second ? true : false;
        },
    });
})(jQuery);