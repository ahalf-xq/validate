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
                if (!isNumU && !isNumL) {
                    return false;
                }
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
            var that = this;
            $el.each(function() {
                var $this = $(this),
                    className = $this.attr('class'), match, rangeStr, lower, upper;
                if ($this.hasClass('required')) {
                    if (!that.verReq($this)) {
                        return false;
                    }
                }
                if ($this.hasClass('num')) {
                    if (!that.verNum($this)) {
                        return false;
                    }
                }
                if ($this.hasClass('posNum')) {
                    if (!that.verPosNum($this)) {
                        return false;
                    }
                }
                if ($this.hasClass('notNegNum')) {
                    if (!that.verNotNegNum($this)) {
                        return false;
                    }
                }
                //使用()/[]来确定包含上下限 的情况
                //[num1, num2] -1
                //(num1,num2]  -2
                //[num1, num2) -3
                //(num1, num2) -4
                match = className.match(/numRange\[(\d),(\d)\]/);
                if (match) {
                    type = 1;
                } else {
                    match = className.match(/numRange\((\d),(\d)\]/);
                    if (match) {
                        type = 2;
                    } else {
                        match = className.match(/numRange\[(\d),(\d)\)/);
                        if (match) {
                            type = 3;
                        } else {
                            match = className.match(/numRange\((\d),(\d)\)/);
                            if (match) {
                                type = 4;
                            }
                        }
                    }
                }
                if (match) {
                    lower = match[1];
                    upper = match[2];
                    if (!that.verNumRange($this, type, lower, upper)) {
                        return false;
                    }
                }
                return true;
            });
        },
        verReq: function($el) {
            var elV = $el.val(),
                errTxt;
            if (this.isEmpStr(elV)) {
                errTxt = '不能为空';
            } else if (this.isSpace(elV)) {
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
            if (!this.isPosNum(elV)) {
                errTxt = '须填入非负数';
            }
            return this._verFn($el, errTxt);
        },
        verNumRange: function($el, type, lower, upper) {
            var elV = $el.val(),
                errTxt;
            if (!this.isNumInRange(elV, type, lower, upper)) {
                errTxt = '取值范围：' + lower + '-' + upper;
            }
            return this._verFn($el, errTxt);
        },
        _verFn: function($el, errTxt) {
            var $parent = $el.closest('.form-group');
            if (errTxt) {
                $el.tooltip({
                    'placement': 'top',
                    'title': errTxt,
                    'trigger': 'hover'
                });
                $parent.addClass('has-error');
                return false;
            }
            if ($parent.hasClass('has-error')) {
                $parent.removeClass('has-error');
                $el.tooltip('destroy');
            }
            return true;
        },
        removeVer: function($el) {
    
        }
    },
    formVer = function($form) {
        var that = this,
            vaElems = $form.find('.va');
        //Bind Blur-Validate To Element contains class 'va'
        vaElems.each(function() {
            $(this).blur(function() {
                that.validate($(this));
            });
        });
        //validate when save form info
        //if return false,you can stop form submit
        this.saveVer = function() {
            if (this.validate(vaElems)) {
                return true;
            }
            return false;
        };
    };
    formVali.prototype = ver;
    $.fn.validate = {};
    $.fn.validate = function() {
        var $form = $(this);
        return new formVer($form);
    };
}());
