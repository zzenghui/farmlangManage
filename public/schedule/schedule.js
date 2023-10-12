
import calendar  from './calendar.js';

//日期格式化
function concatDate(y, m, d) {
    var symbol = '-';
    if (m) {
        m = (m.toString())[1] ? m : '0' + m;
    }
    if (d) {
        d = (d.toString())[1] ? d : '0' + d;
    }

    return y + (m ? symbol + m : '') + (d ? symbol + d : '');
}
//得到时间戳
function getTimeStamp(d) {

    var date = new Date(d);

    if (isNaN(date.getTime())) {
        return '';
    }

    return date.getTime();
}

//polyfill
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
//过滤非日期，格式化日期
function filterDate(arr) {

    if (!Array.isArray(arr)) {
        return [];
    }

    arr = arr || [];
    var dateArr = [];

    for (var i = 0; i < arr.length; i++) {

        var item = arr[i];
        var date = new Date(item);

        if (isNaN(date.getTime())) {
        } else {
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate();
            var dateStr = concatDate(y, m + 1, d);
            dateArr.push(dateStr);
        }
    }

    return dateArr;
}

function hasClass(ele, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
}

function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

function removeElement() {
    var childEles = this.children;
    for (var i = childEles.length - 1; 0 <= i; i--) {
        this.removeChild(childEles[i]);
    }
}


const _arr = ['日', '一', '二', '三', '四', '五', '六'].map(e=> e = '周'+e)

export default class Schedule {
    constructor(opt) {
        this.el = null;
        this._table = document.createElement('table');
        this._thead = document.createElement('thead');
        this._tbody = document.createElement('tbody');
        this.curDate = null;
        this.year = null;
        this.month = null;
        this.currentYear = null;
        this.currentMonth = null;
        this.currentDay = null;
        this.columns = null;
        this.callback = null;
        this.selectCallback = null;


        this.disabledDate = null;
        this.disabledBefore = null;
        this.disabledAfter = null;

            // 是否打开 阴历
        this.isCalendar = null;
        this.isOtherMonth = null;
        // 当前月份
        this.todayDate = '';
        this.currentDate = '';
        this.datas = new Map();
        this.tds = new Map();
     /*   this.init();*/
    }

    _initTable() {
        addClass(this._table, 'tb-style');
        this._table.appendChild(this._thead);
        this._table.appendChild(this._tbody);
        this.el.appendChild(this._table);
    }

    // 下一个月
    nextMonthFun() {
        if (this.month + 1 > 11) {
            this.year += 1;
            this.month = 0;
        } else {
            this.month += 1;
        }
        this.render();
    }

    // 下一年
    nextYearFun() {
        this.year += 1;
        this.render();
    }

    // 上一个月
    prevMonthFun() {
        if (this.month - 1 < 0) {
            this.year -= 1;
            this.month = 11;
        } else {
            this.month -= 1;
        }
        this.render();
    }

    // 上一年
    prevYearFun() {
        this.year -= 1;
        this.render();
    }

    // 今天
    renderToday() {
        if (this.year === this.currentYear && this.month === this.currentMonth) {
            return;
        }

        this.year = this.currentYear;
        this.month = this.currentMonth;
        this.render();
    }

    _createTitle() {
        var tr = document.createElement('tr');
        _arr.forEach(val => {
            var th = document.createElement('th');
            th.innerText = val;
            tr.appendChild(th);

        });
        this._thead.appendChild(tr);
    }
    clear() {
        // 清除所有行
        this.removeRows();
        // 清除缓存数据
        this.datas.clear();
        // 清除列元素
        this.tds.clear();
    }
    render() {

        const { fullDay, startWeek, total, lastMonthDay } = this.getInitNews();
        this.clear();
        let k = 0;

        for (let i = 0; i < (total / 7); i++) {
            const _tr = this.initRow();
            for (let j = 0; j < 7; j++) {
                const sum = k + 1 - startWeek;
                if (k < startWeek) {
                    this.initOtherMonth(_tr, `${(lastMonthDay - startWeek + 1 + k)}`, sum);
                } else if (k < (startWeek + fullDay)) {
                    this.initThisMonth(_tr, `${(k + 1 - startWeek)}`, sum);
                } else {
                    // 补齐剩余内容
                    this.initOtherMonth(_tr, `${(k + 1 - (startWeek + fullDay))}`, sum);
                }
                k += 1;
            }
        }
        if (this.callback) {
            this.callback(this.today);
        }
    }

    //获取本月、上个月、总天数信息
    getInitNews() {
        //当月总天数
        const fullDay = new Date(this.year, this.month + 1, 0).getDate();
        //当月第一天是周几
        const startWeek = new Date(this.year, this.month, 1).getDay();
        //元素总个数
        const total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7);
        //上月最后一天
        const lastMonthDay = new Date(this.year, this.month, 0).getDate();

        return { fullDay, startWeek, total, lastMonthDay }
    }

    // 初始化本月日期
    initThisMonth(tr, text, sum) {
        const nowDate = concatDate(this.year, this.month + 1, sum);
        const { td, p } = this.initColumn(tr, nowDate);
        let className = this.todayDate == nowDate ? 'today-flag' : '';
        td.className = 'dayStyle';

        p.innerHTML = text;
        tr.appendChild(td);
        this.setDataAndtd(nowDate, td);
        if(this.columns){
          this._setClounm(nowDate, td); 
        }
        let isDisbale = false;
        const nowTimestamp = new Date(nowDate).getTime();


        if (this.disabledDate.indexOf(nowDate) > -1) {
            className = 'disabled';
            isDisbale = true;
        }

        if (this.disabledBefore && nowTimestamp < this.disabledBefore) {
            className = 'disabled';
            isDisbale = true;
        }

        if (this.disabledAfter && nowTimestamp > this.disabledAfter) {
            className = 'disabled';
            isDisbale = true;
        }

        if (nowDate && !isDisbale) {
            this._bindEvent(td, nowDate);
        }

        if (isDisbale) {
            className = 'disabled';
        }

        addClass(td, className);

        if (!this.isCalendar) { return; }

        this.initCalendar(sum, td);
    }

    setDataAndtd(nowDate, td) {
        if (!this.datas.has(nowDate)) {
            this.datas.set(nowDate, {
                date: nowDate
            });
            this.tds.set(nowDate, td);
        }
    }

    // 初始化其他月份信息
    initOtherMonth(tr, text, sum) {

        const { td, p } = this.initColumn(tr);
        if (this.isOtherMonth) {
            p.innerHTML = text;
            td.className = 'other-month dayStyle';
        }
        tr.appendChild(td);

        if (!this.isCalendar || !this.isOtherMonth) { return };
        this.initCalendar(sum, td);
    }

    _setClounm(date, td) {
         
        const column = this.columns.find(r => r.date == date);
        if (!column) return;
        if (column.className) {
            addClass(td, column.className);
        }
        if (column.formatter) {
            const e = column.formatter(date);
            if (e) {
                e.forEach(val => {
                    const aside = document.createElement('aside');

                    td.appendChild(aside)

                    aside.innerHTML = val.title;

                    aside.className = val.className;

                });
            }
        }
    }

    setClounm(column) {
        if (!column && !column.date) return;
        const td = this.tds.get(column.date);
        if (!td) return;
        if (column.className) {
            addClass(td, column.className);
        }
        if (column.formatter) {
            const e = column.formatter(column.date);
            if (e) {
                e.forEach(val => {
                    const aside = document.createElement('aside');

                    td.appendChild(aside)

                    aside.innerHTML = val.title;

                    aside.className = val.className;

                });
            }
        }
    }

    // 初始化阴历
    initCalendar(sum, td) {
         const { IDayCn } = calendar.solar2lunar(this.year, this.month + 1, sum);
                if (!IDayCn) return;
                const _p = document.createElement('p');
                _p.innerHTML = IDayCn;
                td.appendChild(_p);
    }

    // 初始化行
    initRow() {
        const _tr = document.createElement('tr');
        this._tbody.appendChild(_tr);
        return _tr;
    }

    // 初始化列
    initColumn(tr) {
        const td = document.createElement('td');
        tr.appendChild(td);
        const p = document.createElement('p');
        td.appendChild(p);
        return { td, p };
    }

    // 创建p
    initContent(td) {
        const p = document.createElement('p');
        td.appendChild(p);
        return p;
    }

    // 获取当前日期
    get getDate() {
        return this.datas.get(this.currentDate);
    }

    // 当前显示月份
    get today() {
        return concatDate(this.year, this.month + 1);
    }

    // 移除行
    removeRows() {
        removeElement.call(this._tbody);
    }

    // 绑定事件
    _bindEvent(ele, date) {
        const _this = this;
        ele.addEventListener('click', function (key) {
            return (e) => {
                _this.currentDate = key;
                if (_this.datas.has(key)) {
                    _this.clearClassNames();
                    addClass(_this.tds.get(key), 'current');
                    if (_this.selectCallback) {
                        _this.selectCallback(_this.datas.get(key));
                    }
                }
            }
        }(date), false);
    }
    // 清除当前所有样式 current
    clearClassNames() {
        this.tds.forEach(val => {
            removeClass(val, 'current');
        });
    }

    setOptions(opt) {
        this.el = opt.el;
        this.curDate = opt.date ? new Date(opt.date) : new Date();
        this.year = this.curDate.getFullYear();
        this.month = this.curDate.getMonth();
        this.currentYear = this.curDate.getFullYear();
        this.currentMonth = this.curDate.getMonth();
        this.currentDay = this.curDate.getDate();
        this.columns = opt.columns;
        this.callback = opt.callback;
        this.selectCallback = opt.selectCallback;
        this.disabledDate = opt.disabledDate ? filterDate(opt.disabledDate) : [],
        this.disabledBefore = opt.disabledBefore ? getTimeStamp(opt.disabledBefore) : '',
        this.disabledAfter = opt.disabledAfter ? getTimeStamp(opt.disabledAfter) : '',
            // 是否打开 阴历
        this.isCalendar = opt.isCalendar;
        this.isOtherMonth = opt.isOtherMonth;
        this.todayDate = concatDate(this.currentYear, this.currentMonth + 1, this.currentDay);
        this.currentDate = this.todayDate;

    }

    // 初始化
    init(opt) {
        this.setOptions(opt);
        this._initTable();
        this._createTitle();
        this.render();
    }
}
