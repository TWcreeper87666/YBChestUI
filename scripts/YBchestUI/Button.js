import { ItemStack, ItemLockMode } from '@minecraft/server';
import { Page } from './Page';
import { ICON } from './items';
export var UpdateMode;
(function (UpdateMode) {
    UpdateMode["all"] = "all";
    UpdateMode["air"] = "air";
    UpdateMode["icon"] = "icon";
})(UpdateMode || (UpdateMode = {}));
/** 按鈕類別 */
export class Button {
    // replaceMode = ""
    /**
     * 建構子
     * @param slot 按鈕的欄位
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     * @returns 新建的 Button 實例
     */
    constructor(slot, nameTag, details) {
        /** 按鈕更新模式 */
        this.updateMode = "all";
        this.slot = slot;
        this.item = new ItemStack(details?.icon ? ICON[details.icon] : ICON.air, details?.amount);
        this.item.nameTag = nameTag;
        this.item.setLore(details?.lords);
        this.item.lockMode = ItemLockMode.inventory;
        if (details?.pageAfterClick instanceof Page)
            this.pageAfterClick = details.pageAfterClick.name;
        else if (details?.pageAfterClick)
            this.pageAfterClick = details.pageAfterClick;
        if (typeof details?.onClickFunc === 'function')
            this.onClickFunc = details.onClickFunc;
        if (details?.updateMode === "icon")
            this.updateMode = "icon";
    }
    /** 設定按鈕的點擊事件 @param onClickFunc 點擊事件回呼函式 */
    setOnClickFunc(onClickFunc) {
        this.onClickFunc = onClickFunc;
    }
}
