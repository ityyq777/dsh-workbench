/** 标签域：tag/tag_mapping 都是行级表，LWW 由协议层处理。 */
export const tagSync = {
  tables: [
    { name: "tag", mode: "row" },
    {
      name: "tag_mapping",
      mode: "row",
      uniqueKeys: [["tag_id", "item_id", "item_type"]],
      uniquePolicy: "lww-tombstone",
    },
  ],
};
