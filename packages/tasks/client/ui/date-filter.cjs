// One calendar selects both endpoints; API values remain inclusive ISO dates.
var React = require("react"), h = React.createElement;
var Icon = require("./icons.cjs").Icon;
function validDate(value) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  var d = new Date(value + "T00:00:00Z");
  return isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value && value.slice(0, 4) !== "0000";
}
function normalize(value) {
  var from = value.from || "", to = value.to || "";
  if (!validDate(from) || !validDate(to)) return null;
  return from && to && from > to ? {from:to,to:from,swapped:true} : {from:from,to:to,swapped:false};
}
function today() {
  var d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function shift(date, days) { var d=new Date(date+"T00:00:00Z"); d.setUTCDate(d.getUTCDate()+days); return d.toISOString().slice(0,10); }
function DateFilter(props) {
  var en=props.lang==="en", value=props.value;
  var names=en?{publish:"Publication",done:"Completion",shutdown:"Closure",target:"Target"}:{publish:"发布",done:"完成",shutdown:"关闭",target:"目标"};
  var name=names[props.kind]||names.publish, title=name+(en?" date range":"时间范围");
  var openS=React.useState(false), open=openS[0], setOpen=openS[1];
  var startS=React.useState(""), start=startS[0], setStart=startS[1];
  var monthS=React.useState((value.from||value.to||today()).slice(0,7)), month=monthS[0], setMonth=monthS[1];
  var focusS=React.useState(""), focus=focusS[0], setFocus=focusS[1];
  var root=React.useRef(null), trigger=React.useRef(null), id=React.useId();
  React.useEffect(function(){if(open&&focus&&root.current){var b=root.current.querySelector('[data-day="'+focus+'"]');if(b)b.focus();}},[open,focus,month]);
  function close(){setOpen(false);setStart("");if(trigger.current)trigger.current.focus();}
  function apply(next){var result=normalize(next);if(result){props.onChange(result);close();}}
  function pick(day){if(!start)setStart(day);else apply({from:start,to:day});}
  function moveMonth(delta){var d=new Date(month+"-01T00:00:00Z");d.setUTCMonth(d.getUTCMonth()+delta);var next=d.toISOString().slice(0,7);if(/^\d{4}-\d{2}$/.test(next)&&next.slice(0,4)!=="0000")setMonth(next);}
  function keyDay(e,day){var delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];if(delta){e.preventDefault();var next=shift(day,delta);if(validDate(next)){setMonth(next.slice(0,7));setFocus(next);}}}
  var first=month+"-01", offset=new Date(first+"T00:00:00Z").getUTCDay();
  var count=new Date(Number(month.slice(0,4)),Number(month.slice(5)),0).getDate(), cells=[];
  for(var i=0;i<offset;i++)cells.push(h("span",{key:"empty"+i,"aria-hidden":true}));
  for(var n=1;n<=count;n++){
    var day=month+"-"+String(n).padStart(2,"0"), endpoint=start?day===start:day===value.from||day===value.to;
    var inside=!start&&value.from&&value.to&&day>value.from&&day<value.to;
    cells.push(h("button",{key:day,type:"button","data-day":day,"aria-label":day,"aria-pressed":!!endpoint,"aria-current":day===today()?"date":undefined,
      className:"wbt-range-day"+(endpoint?" selected":"")+(inside?" between":""),onClick:pick.bind(null,day),onKeyDown:function(d,e){keyDay(e,d);}.bind(null,day)},n));
  }
  var summary=value.from&&value.to?value.from+" — "+value.to:value.from?value.from+(en?" onward":" 起"):value.to?(en?"Until ":"截至 ")+value.to:(en?"Choose date range":"选择日期范围");
  return h("div",{className:"wbt-publication-filter",ref:root,onKeyDown:function(e){if(e.key==="Escape"&&open){e.stopPropagation();close();}}},
    h("div",{className:"wbt-range-entry"},h("button",{ref:trigger,type:"button",className:"wbt-btn wbt-range-trigger","aria-label":title+": "+summary,"aria-expanded":open,"aria-controls":id,onClick:function(){setStart("");setFocus("");setMonth((value.from||value.to||today()).slice(0,7));setOpen(!open);}},h(Icon,{name:"calendar"}),h("span",null,summary)),
      value.from||value.to?h("button",{type:"button",className:"wbt-date-clear","aria-label":en?"Clear time range":"清除时间范围",onClick:function(){apply({from:"",to:""});}},"×"):null),
    open?h("div",{id:id,className:"wbt-range-calendar",role:"group","aria-label":title},
      h("div",{className:"wbt-range-month"},h("button",{type:"button",className:"wbt-btn ghost","aria-label":en?"Previous month":"上个月",onClick:function(){moveMonth(-1);}},"‹"),
        h("input",{type:"month",value:month,min:"0001-01",max:"9999-12","aria-label":en?"Calendar month":"日历月份",onChange:function(e){if(validDate(e.target.value+"-01"))setMonth(e.target.value);}}),
        h("button",{type:"button",className:"wbt-btn ghost","aria-label":en?"Next month":"下个月",onClick:function(){moveMonth(1);}},"›")),
      h("p",{className:"wbt-mhint",role:"status"},start?(en?"Start: ":"起始：")+start+(en?" · Choose end date":" · 请选择结束日期"):(en?"Choose start, then end date":"先选开始日期，再选结束日期")),
      h("div",{className:"wbt-range-grid"},(en?["Su","Mo","Tu","We","Th","Fr","Sa"]:["日","一","二","三","四","五","六"]).map(function(x){return h("span",{key:x,className:"wbt-range-weekday","aria-hidden":true},x);}),cells),
      start?h("div",{className:"wbt-range-actions"},h("button",{type:"button",className:"wbt-btn ghost",onClick:function(){apply({from:start,to:""});}},en?"From this date":"仅起始日期"),h("button",{type:"button",className:"wbt-btn ghost",onClick:function(){apply({from:"",to:start});}},en?"Until this date":"仅截止日期")):null,
      h("button",{type:"button",className:"wbt-btn ghost",onClick:close},en?"Cancel":"取消")):null);
}
module.exports={DateFilter:DateFilter,normalize:normalize,validDate:validDate,today:today,shift:shift};
