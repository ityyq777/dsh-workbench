var React = require("react"), h = React.createElement;
var model = require("./heatmap-model.cjs"), css = require("./heatmap-styles.cjs");
function Heatmap(props) {
  var lang = props.lang === "en" ? "en" : "zh", t = model.COPY[lang];
  var yearState = React.useState(new Date().getFullYear()), year = yearState[0], setYear = yearState[1];
  var typeState = React.useState("done"), type = typeState[0], setType = typeState[1];
  var resultState = React.useState(null), result = resultState[0], setResult = resultState[1];
  var errorState = React.useState(false), error = errorState[0], setError = errorState[1];
  var tipState = React.useState(""), tip = tipState[0], setTip = tipState[1];
  var refreshState = React.useState(0), refresh = refreshState[0], setRefresh = refreshState[1];
  var cache = React.useMemo(function(){return new Map();},[props.api]);
  React.useEffect(function() {
    if (props.active === false) return;
    var alive = true;
    setResult(null); setError(false); setTip("");
    if (!cache.has(year)) {
      var request = Promise.resolve().then(function(){return props.api.call("tasks.activityCalendar",{year:year});}).then(function(r){
        if (!r || r.ok === false) throw new Error("calendar unavailable");
        var data = r.result === undefined ? r : r.result;
        if (data.year !== year || !Array.isArray(data.days)) throw new Error("invalid calendar");
        return data;
      });
      cache.set(year,request);
      request.catch(function(){if(cache.get(year)===request)cache.delete(year);});
    }
    cache.get(year).then(function(data){if(alive)setResult(data);},function(){if(alive)setError(true);});
    return function(){alive=false;};
  },[props.api,props.active,year,cache,refresh]);
  React.useEffect(function(){
    if (!props.api.subscribe) return;
    return props.api.subscribe(function(p){if(p && p.event === "tasks-changed"){cache.clear();setRefresh(function(n){return n+1;});}});
  },[props.api,cache]);
  var geometry = model.calendar(year), today = model.localDay(new Date()), byDate = {};
  if(result)result.days.forEach(function(d){byDate[d.date]=d;});
  var ready = result && result.year === year;
  var total = ready ? result.days.reduce(function(n,d){return n+model.count(d,type);},0) : 0;
  var content;
  if(error)content=h("div",{className:"wbt-hm-state",role:"alert"},t.error," · ",h("button",{className:"wbt-hm-control",onClick:function(){cache.delete(year);setRefresh(function(n){return n+1;});}},t.retry));
  else if(!ready)content=h("div",{role:"status","aria-label":t.loading},h("div",{className:"wbt-hm-skeleton","aria-hidden":true}),t.loading);
  else if(!total)content=h("div",{className:"wbt-hm-state",role:"status"},t.empty[type]);
  else content=h(React.Fragment,null,
    h("div",{className:"wbt-hm-scroll"},h("div",{className:"wbt-hm-layout",style:{"--hm-weeks":geometry.weeks}},
      h("div",{className:"wbt-hm-weekdays","aria-hidden":true},t.weekdays.map(function(s){return h("span",{key:s},s);})),
      h("div",{className:"wbt-hm-body"},
        h("div",{className:"wbt-hm-months","aria-hidden":true},geometry.days.filter(function(d){return d.first;}).map(function(d){return h("span",{key:d.date,style:{gridColumn:d.column}},new Date(Date.UTC(year,d.month,1)).toLocaleString(lang==="en"?"en-US":"zh-CN",{month:"short",timeZone:"UTC"}));})),
        h("div",{className:"wbt-hm-grid"},geometry.days.map(function(d){
          var day=byDate[d.date]||{}, future=d.date>today, enabled=!future && model.count(day,type)>0;
          var title=model.label(d.date,day,t,type)+(future?" · "+t.future:!model.count(day,type)?" · "+t.none:"");
          return h("button",{key:d.date,type:"button",className:"wbt-hm-day"+(future?" wbt-hm-future":""),"data-date":d.date,title:title,"aria-label":title,"aria-disabled":!enabled,
            style:{gridColumn:d.column,gridRow:d.row,background:future?"var(--hm-empty)":model.background(day,type)},
            onMouseEnter:function(){setTip(title);},onMouseLeave:function(){setTip("");},onFocus:function(){setTip(title);},onBlur:function(){setTip("");},
            onClick:function(){if(enabled && props.onNavigate)props.onNavigate("tasks",{activityDate:d.date,activityType:type});}
          });
        }))
      )
    ))
  );
  return h("section",{className:"wbt-heatmap","aria-label":t.title},h("style",null,css),
    h("div",{className:"wbt-hm-head"},h("h3",null,t.title),h("div",{className:"wbt-hm-years"},
      h("button",{type:"button",className:"wbt-hm-control","aria-label":t.previous,disabled:year<=1900,onClick:function(){setYear(year-1);}},"‹"),
      h("strong",{"aria-live":"polite"},year),h("button",{type:"button",className:"wbt-hm-control","aria-label":t.next,disabled:year>=9999,onClick:function(){setYear(year+1);}},"›"))),
    content,h("div",{className:"wbt-hm-legend"},
      h("div",{className:"wbt-hm-types",role:"tablist","aria-label":t.title},model.TYPES.map(function(k){return h("button",{key:k,type:"button",className:"wbt-hm-control",role:"tab","aria-selected":type===k,onClick:function(){setType(k);setTip("");}},h("span",{className:"wbt-hm-swatch",style:{background:"var(--hm-"+k+"-4)"},"aria-hidden":true}),t[k]);})),
      ready && h("span",{className:"wbt-hm-summary","aria-live":"polite"},tip||t.total+" · "+total),
      type==="claimed" && h("span",{className:"wbt-hm-intensity-label"},t.claimedNote),
      h("div",{className:"wbt-hm-intensity",role:"img","aria-label":model.legendLabel(lang)},
        h("span",{className:"wbt-hm-intensity-label","aria-hidden":true},t.dailyCount),
        model.LEVELS.map(function(entry,index){return h("span",{key:entry.label,className:"wbt-hm-intensity-item","aria-hidden":true},
          h("span",{className:"wbt-hm-swatch",style:{background:"var(--hm-"+type+"-"+(index+1)+")"},"aria-hidden":true}),entry.label);})
      )
    )
  );
}
module.exports = Heatmap;
