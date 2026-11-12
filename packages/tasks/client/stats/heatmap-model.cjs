// Calendar geometry uses UTC only for date arithmetic; keys represent local calendar dates.
var TYPES = ["done", "publish", "shutdown", "claimed"];
var LEVELS = [{min:1,max:1,label:"1"},{min:2,max:3,label:"2–3"},{min:4,max:6,label:"4–6"},{min:7,max:null,label:"7+"}];
var COPY = {
  zh: { title: "年度活动", previous: "上一年", next: "下一年", done: "完成", publish: "发布", shutdown: "关闭", claimed: "接取", empty: {done:"本年度没有完成记录",publish:"本年度没有发布记录",shutdown:"本年度没有关闭记录",claimed:"本年度没有接取记录"}, loading: "正在加载年度活动", error: "年度活动加载失败", retry: "重试", future: "未来日期", none: "无活动", clear: "清除活动筛选", filter: "活动筛选", total: "活动总数", dailyCount: "每日次数", weekdays: ["一", "二", "三", "四", "五", "六", "日"], claimedNote: "已接取/已完成任务；历史任务未记录接取时间，按发布日期计" },
  en: { title: "Annual task activity", previous: "Previous year", next: "Next year", done: "Done", publish: "Published", shutdown: "Closed", claimed: "Claimed", empty: {done:"No completed tasks this year",publish:"No published tasks this year",shutdown:"No closed tasks this year",claimed:"No claimed tasks this year"}, loading: "Loading annual activity", error: "Could not load annual activity", retry: "Retry", future: "Future date", none: "No activity", clear: "Clear activity filter", filter: "Activity filter", total: "Total events", dailyCount: "Daily count", weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], claimedNote: "claimed or completed tasks; historical tasks without a claim time use the publish date" }
};
function localDay(d) { return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); }
function calendar(year) {
  var start = Date.UTC(year,0,1), count = (Date.UTC(year+1,0,1)-start)/86400000;
  var offset = (new Date(start).getUTCDay()+6)%7;
  return { weeks: Math.ceil((offset+count)/7), days: Array.from({length:count},function(_,i) {
    var d = new Date(start+i*86400000);
    return { date: d.toISOString().slice(0,10), row:(offset+i)%7+1, column:Math.floor((offset+i)/7)+1, month:d.getUTCMonth(), first:d.getUTCDate()===1 };
  }) };
}
function level(n) { return LEVELS.reduce(function(value,entry,index){return n >= entry.min ? index+1 : value;},1); }
function legendLabel(lang) {
  return COPY[lang].dailyCount + (lang === "en" ? ": " : "：") + LEVELS.map(function(entry){
    if(lang === "en")return entry.max === null ? entry.min+" or more events" : entry.min === entry.max ? entry.min+" event" : entry.min+" to "+entry.max+" events";
    return entry.max === null ? entry.min+" 次以上" : entry.min === entry.max ? entry.min+" 次" : entry.min+" 到 "+entry.max+" 次";
  }).join(lang === "en" ? "; " : "；");
}
function count(day,type) { return Number(day[type])||0; }
function background(day,type) { return count(day,type) ? "var(--hm-"+type+"-"+level(count(day,type))+")" : "var(--hm-empty)"; }
function label(date,day,t,type) { return date+" · "+t[type]+" "+count(day,type); }
function activityParams(params) {
  if (!params || !/^\d{4}-\d{2}-\d{2}$/.test(params.activityDate || "")) return null;
  return { activityDate:params.activityDate, activityType:TYPES.indexOf(params.activityType)>=0 ? params.activityType : "done" };
}
module.exports = { TYPES:TYPES, LEVELS:LEVELS, COPY:COPY, legendLabel:legendLabel, localDay:localDay, calendar:calendar, level:level, count:count, background:background, label:label, activityParams:activityParams };
