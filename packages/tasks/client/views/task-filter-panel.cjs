// Render-only filter panel; state and request ownership stay in TasksView.
var Icon = require("../ui/icons.cjs").Icon;
var model = require("./task-filter-model.cjs"), DateFilter = require("../ui/date-filter.cjs").DateFilter;
var WorkspaceFilter = require("../ui/workspacefilter.cjs");
// Keep an editing draft so typing “10” does not swap the range after its first digit.
function NumberInput(p) {
  var React = p.React, draftState = React.useState(String(p.value)), draft = draftState[0], setDraft = draftState[1];
  React.useEffect(function () { setDraft(String(p.value)); }, [p.value]);
  function commit(node) {
    var result = p.commit(node.validity && node.validity.badInput ? "invalid" : draft);
    setDraft(result === undefined ? String(p.value) : result);
  }
  return React.createElement("input", {type:"number",className:"wbt-input wbt-limit-input",min:p.min,max:p.max,step:p.step,inputMode:p.step === 1 ? "numeric" : "decimal",value:draft,
    "aria-label":p.label,placeholder:p.placeholder,onChange:function(e){setDraft(e.target.value);},
    onBlur:function(e){commit(e.currentTarget);},onKeyDown:function(e){
      if(e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
      if(e.key === "Escape") { e.preventDefault(); setDraft(String(p.value)); }
    }});
}
module.exports = function renderFilterPanel(React, p) {
  var h = React.createElement, en = p.lang === "en", value = p.value;
  var title = en ? "Filters" : "筛选";
  var labels = en ? {publish:"Publication range",done:"Completion range",shutdown:"Closure range",claimed:"Claim range",target:"Target range"} : {publish:"发布时间范围",done:"完成时间范围",shutdown:"关闭时间范围",claimed:"接取时间范围",target:"目标日期范围"};
  var options = [["all",en?"All":"全部"],["0",en?"Opened":"已开启"],["2",en?"Completed":"已完成"],["1",en?"Closed":"已关闭"],["3",en?"Restarted":"已重启"],["4",en?"Claimed":"已接取"]];
  // 快捷预设只是筛选值的组合；激活态从当前值推导，手动改任何条件都会自动熄灭。
  var presetNames = en
    ? {urgent:"Urgent (P8–10)",hard:"Hard (D4–5)",overdue:"Overdue",dueToday:"Due today",recentDone:"Done in 7 days",claimed:"Claimed"}
    : {urgent:"紧急任务 P8–10",hard:"高难度 D4–5",overdue:"已逾期",dueToday:"今日到期",recentDone:"近 7 天完成",claimed:"已接取"};
  var activePreset = model.activePreset(value);
  var unitId = p.id + "-unit";
  var units = en ? {priority:"0–10, higher is more urgent", difficulty:"0–5 in half steps, higher is harder"} : {priority:"0–10，越大越紧急", difficulty:"0–5，半档递增，越大越难"};
  function change(next) { p.onChange(next); }
  function pickPreset(id) {
    p.onHint("");
    if (p.onMissingChange) p.onMissingChange(false);
    change(id === activePreset ? model.empty() : model.presetValue(id));
  }
  function setRange(key, input) {
    var result = model.range(value,key,input);
    if (!result) { p.onHint(en ? "Enter a valid date" : "请输入有效日期"); return; }
    var hints = [];
    if (result.swapped || input.swapped) hints.push(en ? "Start was after end; dates swapped" : "起始晚于终止，已交换");
    if (result.autoSelected) hints.push(en ? "Corresponding status selected automatically" : "已自动勾选对应状态");
    p.onHint(hints.join(" · ")); change(result.value);
  }
  function setLimit(key, end, text) {
    var result = model.limit(value,key,end,text);
    if (!result) { p.onHint(en ? (key === "difficulty" ? "Difficulty takes 0.5 steps from 0 to 5" : "Priority takes whole numbers 0–10") : (key === "difficulty" ? "难度仅接受 0–5 之间的半档数值" : "优先级仅接受 0–10 的整数")); return; }
    var hints = [];
    if (result.swapped) hints.push(en ? "Start was above end; values swapped" : "起始大于终止，已交换");
    if (result.clearsMissing && p.difficultyMissing) hints.push(en ? "Cleared “difficulty unset only”" : "已取消「仅未填难度」");
    p.onHint(hints.join(" · "));
    if (result.clearsMissing && p.onMissingChange) p.onMissingChange(false);
    change(result.value);
    return result.value[key][end];
  }
  function limitRow(key, label) {
    var box = value[key], spec = model.limits[key];
    function field(end) {
      var labelText = en ? (end === "min" ? "Minimum " : "Maximum ") + label : (end === "min" ? "最低" : "最高") + label;
      return h(NumberInput,{React:React,value:box[end],min:spec.min,max:spec.max,step:spec.step,label:labelText,placeholder:String(end === "min" ? spec.min : spec.max),commit:function(text){return setLimit(key,end,text);}});
    }
    function clear() {
      p.onHint("");
      change(Object.assign({},value,(function(){var next={};next[key]={min:String(spec.min),max:String(spec.max)};return next;})()));
    }
    return h("div",{className:"wbt-limit-row",key:key},
      h("div",{className:"wbt-limit-head"},
        h("strong",null,label),
        h("span",{className:"wbt-limit-unit",id:unitId+"-"+key},units[key])),
      h("div",{className:"wbt-limit-fields",role:"group","aria-label":label,"aria-describedby":unitId+"-"+key},field("min"),h("span",{className:"wbt-limit-join","aria-hidden":true},en?"to":"至"),field("max"),
        h("button",{type:"button",className:"wbt-btn ghost wbt-limit-clear","aria-label":(en?"Reset ":"重置")+label,title:(en?"Reset ":"重置")+label,onClick:clear},"×")));
  }
  return h("aside", {className:"wbt-filter-panel" + (p.open ? " expanded" : ""),"aria-label":title},
    h("button",{type:"button",className:"wbt-btn wbt-filter-toggle","aria-label":title,title:title,"aria-expanded":p.open,"aria-controls":p.id,onClick:p.onToggle}, h(Icon,{name:"filter"})),
    h("div",{className:"wbt-filter-content",id:p.id},
      h("section",{className:"wbt-filter-group wbt-presets",role:"group","aria-label":en?"Quick filters":"快捷筛选"},
        h("strong",null,en?"Quick filters":"快捷筛选"),
        h("div",{className:"wbt-preset-list"},model.presets.map(function(id){
          var on = id === activePreset;
          return h("button",{key:id,type:"button",className:"wbt-btn wbt-preset"+(on?" active":""),"aria-pressed":on,"data-preset":id,onClick:function(){pickPreset(id);}},presetNames[id]);
        }))),
      h("fieldset",{className:"wbt-filter-group wbt-status-grid"},h("legend",null,en?"Status (match any)":"状态"),options.map(function(option){
        var key = option[0], checked = key === "all" ? model.all(value) : value.statuses.indexOf(key) >= 0;
        return h("label",{key:key,className:"wbt-check"},h("input",{type:"checkbox",checked:checked,"data-status":key,onChange:function(){change(model.toggle(value,key));p.onHint("");}}),option[1]);
      })),
      p.search,
      // 工作区与标签同为下拉多选；「未关联工作区」收在菜单里，互斥由 model.toggle* 保证。
      p.api ? h("div",{className:"wbt-filter-group wbt-ws-group"},h(WorkspaceFilter,{api:p.api,t:p.t,Icon:p.Icon,ids:value.workspaceIds,
        noWorkspace:value.noWorkspace===true,onToggle:function(id){change(model.toggleWorkspace(value,id));},
        onToggleNoWorkspace:function(){change(model.toggleNoWorkspace(value));},
        onClear:function(){change(Object.assign({},value,{workspaceIds:[],noWorkspace:false}));}})) : (p.workspaces || null),
      h("div",{className:"wbt-filter-group"},p.tags,p.missing),
      h("section",{className:"wbt-filter-group wbt-limit-group",role:"group","aria-label":en?"Priority and difficulty":"优先级与难度"},
        limitRow("priority", en ? "Priority" : "优先级"),
        limitRow("difficulty", en ? "Difficulty" : "难度")),
      h("section",{className:"wbt-filter-group wbt-target-group","aria-label":labels.target},
        h("strong",null,labels.target),
        h(DateFilter,{lang:p.lang,kind:"target",value:value.target,onChange:function(next){setRange("target",next);}})),
      model.groups.map(function(key){
        return h("section",{key:key,className:"wbt-filter-group","aria-label":labels[key]},
          h("strong",null,labels[key]),
          h(DateFilter,{lang:p.lang,kind:key,value:value[key],onChange:function(next){setRange(key,next);}}));
      }),
      (value.done.from || value.done.to) && (value.shutdown.from || value.shutdown.to) ? h("div",{className:"wbt-mhint",role:"status"},en?"Completion and closure ranges require different statuses; their intersection is empty.":"完成与关闭范围要求不同状态，同时填写时交集为空。") : null,
      p.hint ? h("div",{className:"wbt-mhint",role:"status"},p.hint) : null));
};
