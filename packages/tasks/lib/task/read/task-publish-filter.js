/** 四组事件日期范围共用真实日期校验；只比较存储值的日期部分。 */
function rangeDay(value, field) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(field + " 必须是合法的 YYYY-MM-DD 日期");
  }
  const [year, month, day] = value.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  if (year < 1 || month < 1 || month > 12 || day < 1 ||
      day > [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]) {
    throw new Error(field + " 必须是合法的 YYYY-MM-DD 日期");
  }
  return value;
}

export function dateRangeFilter(from, to, kind) {
  const fromKey = kind + "From", toKey = kind + "To";
  let start = rangeDay(from, fromKey), end = rangeDay(to, toKey);
  const notices = [];
  if (start && end && start > end) {
    [start, end] = [end, start];
    const label = { publish: "发布", done: "完成", shutdown: "关闭", claimed: "接取" }[kind];
    notices.push({ code: kind + "_range_swapped", field: fromKey + "/" + toKey,
      message: label + "日期起始晚于终止，已交换", [fromKey]: start, [toKey]: end });
  }
  return { [fromKey]: start, [toKey]: end, notices };
}

export function publishFilter(from, to) {
  return dateRangeFilter(from, to, "publish");
}
