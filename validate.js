/**
 *验证
 *NOTE:BASE ON tooltip.js of bootstrap
 */
(function() {
    var ver = {
    //基础判断方法
        isNull: function(el) {
            if (el === null) {
                return true;
            }
            return false;
        },
        isEmpObj: function(el) {
            var key;
            for (key in el) {
                if (el.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        },
        isEmpStr: function(el) {
            if (el === '') {
                return true;
            }
            return false;
        },
        isSpace: function(el) {
            var strWithoutSpace = el.replace(/\s/gi, '');
            return this.isEmpStr(strWithoutSpace);
        },
        isUndefined: function(el) {
            if (typeof el === 'undefined') {
                return true;
            }
            return false;
        },
        isNum: function(el) {
            var elstr = el + '';
            if (this.isEmpStr(elstr) || isNaN(elstr)) {
                return false;
            }
            return true;
        },
        isPosNum: function(el) {
            if (this.isNum(el) && +el > 0) {
                return true;
            }
            return false;
        },
        isNegNum: function(el) {
            if (this.isNum(el) && +el < 0) {
                return true;
            }
            return false;
        },
        isNotPosNum: function(el) {
            if (this.isNum(el) && +el <= 0) {
                return true;
            }
            return false;
        },
        isNotNegNum: function(el) {
            if (this.isNum(el) && +el >= 0) {
                return true;
            }
            return false;
        },
        /**
         *判断数字是否在限定的界限内
         *@param el 元素
         *@param type 类型(1: x0 <= x <= x1, 2: x0 < x <= x1, 3: x0 <= x < x1, 4: x0 < x < x1)
         *@param lower 下限(可空)
         *@param upper 上限(可空)
         */
        isNumInRange: function(el, type, lower, upper) {
            var elV, lowerV, upperV,
                isNumL, isNumU;
            if (this.isNum(el)) {
                elV = +el;
                //
                isNumL = this.isNum(lower);
                isNumU = this.isNum(upper);
                //
                switch (type) {
                    case 1:
                        if (isNumL) {
                            lowerV = +lower;
                            if (elV < lowerV) {
                                return false;
                            }
                        }
                        if (isNumU) {
                            upperV = +upper;
                            if (elV > upperV) {
                                return false;
                            }
                        }
                        break;
                    case 2:
                        if (isNumL) {
                            lowerV = +lower;
                            if (elV <= lowerV) {
                                return false;
                            }
                        }
                        if (isNumU) {
                            upperV = +upper;
                            if (elV > upperV) {
                                return false;
                            }
                        }
                        break;
                    case 3:
                        if (isNumL) {
                            lowerV = +lower;
                            if (elV < lowerV) {
                                return false;
                            }
                        }
                        if (isNumU) {
                            upperV = +upper;
                            if (elV >= upperV) {
                                return false;
                            }
                        }
                        break;
                    case 4:
                        if (isNumL) {
                            lowerV = +lower;
                            if (elV <= lowerV) {
                                return false;
                            }
                        }
                        if (isNumU) {
                            upperV = +upper;
                            if (elV >= upperV) {
                                return false;
                            }
                        }
                        break;
                }
                return true;
            }
            return false;
        },
        //
        validate: function($el) {
            var that = this,
                passFlag = true;
            $el.each(function() {
                var $this = $(this),
                    className = $this.attr('class'), match, type, lower, upper,
                    str_start, str_end, sub_str;
                //不验证项，跳过
                if ($this.hasClass('nova')) {
                    return;
                }
                if ($this.hasClass('required')) {
                    if (!that.verReq($this)) {
                        passFlag = false;
                        return;
                    }
                }
                if ($this.hasClass('num')) {
                    if (!that.verNum($this)) {
                        passFlag = false;
                        return;
                    }
                }
                if ($this.hasClass('posNum')) {
                    if (!that.verPosNum($this)) {
                        passFlag = false;
                        return;
                    }
                }
                if ($this.hasClass('notNegNum')) {
                    if (!that.verNotNegNum($this)) {
                        passFlag = false;
                        return;
                    }
                }
                //使用()/[]来确定包含上下限 的情况
                //[num1,num2] -1
                //(num1,num2] -2
                //[num1,num2) -3
                //(num1,num2) -4
                if (className.indexOf('numRange') > -1) {
                    str_start = className.indexOf('numRange(');
                    if (str_start > -1) {
                        str_end = className.indexOf(')');
                        if (str_end > -1) {
                            type = 4;
                        } else {
                            str_end = className.indexOf(']');
                            type = 2;
                        }
                    } else {
                        str_start = className.indexOf('numRange[');
                        str_end = className.indexOf(']');
                        if (str_end > -1) {
                            type = 1;
                        } else {
                            str_end = className.indexOf(')');
                            type = 3;
                        }
                    }
                    //
                    sub_str = className.substring(str_start + 9, str_end);
                    sub_str = sub_str.split(',');
                    lower = sub_str[0];
                    upper = sub_str[1];
                    if (!that.verNumRange($this, type, lower, upper)) {
                        passFlag = false;
                        return;
                    }
                }
            });
            return passFlag;
        },
        verReq: function($el) {
            var elV = $el.val(),
                errTxt;
            if ($el.hasClass('select2-container')) {
                return true;
            }
            if (this.isEmpStr(elV) || (!elV || elV.length === 0)) {//后面情况适用与select（多选）
                errTxt = '不能为空';
            } else if (this.isSpace(elV.toString())) {
                errTxt = '不能为空格';
            }
            return this._verFn($el, errTxt);
        },
        verNum: function($el) {
            var elV = $el.val(),
                errTxt;
            if (!this.isNum(elV)) {
                errTxt = '须填入数字';
            }
            return this._verFn($el, errTxt);
        },
        verPosNum: function($el) {
            var elV = $el.val(),
                errTxt;
            if (!this.isPosNum(elV)) {
                errTxt = '须填入正数';
            }
            return this._verFn($el, errTxt);
        },
        verNotNegNum: function($el) {
            var elV = $el.val(),
                errTxt;
            if (!this.isNotNegNum(elV)) {
                errTxt = '须填入非负数';
            }
            return this._verFn($el, errTxt);
        },
        verNumRange: function($el, type, lower, upper) {
            var elV = $el.val(),
                errTxt, errHead, errTail;
            if (!this.isNumInRange(elV, type, lower, upper)) {
                if (lower === '*') {
                    switch (type) {
                        case 1:
                            errHead = '取值应小于等于';
                            break;
                        case 2:
                            errHead = '取值应小于等于';
                            break;
                        case 3:
                            errHead = '取值应小于';
                            break;
                        case 4:
                            errHead = '取值应小于';
                            break;
                    }
                    errTxt = errHead + upper;
                } else if (upper === '*') {
                    switch (type) {
                        case 1:
                            errHead = '取值应大于等于';
                            break;
                        case 2:
                            errHead = '取值应大于';
                            break;
                        case 3:
                            errHead = '取值应大于等于';
                            break;
                        case 4:
                            errHead = '取值应大于';
                            break;
                    }
                    errTxt = errHead + lower;
                } else {
                    switch (type) {
                        case 1:
                            errHead = '[';
                            errTail = ']';
                            break;
                        case 2:
                            errHead = '(';
                            errTail = ']';
                            break;
                        case 3:
                            errHead = '[';
                            errTail = ')';
                            break;
                        case 4:
                            errHead = '(';
                            errTail = ')';
                            break;
                    }
                    errTxt = '取值范围：' + errHead + lower + ',' + upper + errTail;
                }
            }
            return this._verFn($el, errTxt);
        },
        _verFn: function($el, errTxt) {
            var $parent = $el.closest('.form-group'),
                $tipOn, b_top, b_right, b_bottom, b_left, tagName;
            //
            if ($parent.length === 0) {
                // 未全部用bootstrap改写的模块使用
                $parent = $el;
                //
                b_top = $el.css('border-top-style');
                b_right = $el.css('border-right-style');
                b_bottom = $el.css('border-bottom-style');
                b_left = $el.css('border-left-style');
            }
            this._removeErr($el, $parent);
            if (errTxt) {
                if ($el.attr('title')) {
                    $el.attr('ori-title', $el.attr('title'));
                    $el.removeAttr('title');
                }
                tagName = $el[0].tagName;
                if (tagName === 'SELECT') {
                    $tipOn = $('#s2id_' + $el[0].id);
                } else {
                    $tipOn = $el;
                }
                $tipOn.tooltip({
                    'placement': 'auto',
                    'title': errTxt,
                    'trigger': 'hover'
                });

                if (tagName === 'INPUT') {
                    if (b_top === 'none' || b_right === 'none' || b_left === 'none' || b_bottom === 'none') {
                        //任一边无边框时，用背景填充
                        $parent.addClass('table-error');
                    } else {
                        $parent.addClass('has-error');
                    }
                } else {
                    $parent.addClass('has-error');
                }
                return false;
            }
            return true;
        },
        _removeErr: function($el, $parent) {
            if ($parent.hasClass('has-error') || $parent.hasClass('table-error')) {
                $parent.removeClass('has-error');
                $parent.removeClass('table-error');
                if ($el[0].tagName === 'SELECT') {
                    //引用select2插件，需要清除包装
                    $('#s2id_' + $el[0].id).tooltip('destroy');
                } else {
                    $el.tooltip('destroy');
                }
                if ($el.attr('ori-title')) {
                    $el.attr('title', $el.attr('ori-title'));
                    $el.removeAttr('ori-title');
                }
            }
        }
    },
    formVer = function($form) {
        var that = this,
            vaElems = $form.find('.va');
        //Bind Blur-Validate To Element contains class 'va'
        vaElems.each(function() {
            switch (this.tagName) {
                case 'SELECT':
                    $(this).change(function() {
                        that.validate($(this));
                    });
                    break;
                case 'INPUT':
                    $(this).blur(function() {
                        that.validate($(this));
                    });
                    break;
            }
        });
        //validate when save form info
        //if return false,you can stop form submit
        this.saveVer = function() {
            if (this.validate(vaElems)) {
                return true;
            }
            return false;
        };
        //
        this.removeVer = function($el) {
            var $els;
            //
            if ($el) {
                $els = $el;
            } else {
                $els = vaElems;
            }
            $els.each(function() {
                var $this = $(this),
                    $parent;
                $parent = $this.closest('.form-group');
                if ($parent.length === 0) {
                    // 未全部用bootstrap改写的模块使用
                    $parent = $this;
                }
                that._removeErr($this, $parent);
            });
        };
    };
    formVer.prototype = ver;
    $.fn.validate = {};
    $.fn.validate = function() {
        var $form = $(this);
        return new formVer($form);
    };
}());
