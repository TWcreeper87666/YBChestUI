import { ItemStack, ItemLockMode } from '@minecraft/server';
import { Page, UIerror, checkTypes, ICON } from './exports';
/** 按鈕類別 */
export class Button {
    // replaceMode = ""
    /**
     * 建構子
     * @param slot 按鈕的欄位
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊 (icon, lore, amount, pageAfterClick, onClickFunc, updateMode)
     * @returns 新建的 Button 實例
     */
    constructor(slot, nameTag, details) {
        /** 按鈕更新模式 */
        this.updateMode = "all";
        checkTypes("new Button", arguments, ['number', 'string', 'object'], 2);
        if (slot >= 54)
            throw new UIerror('欄位最多只有54個 (0-based)');
        this.slot = slot;
        this.item = new ItemStack(details?.icon ? ICON[details.icon] : ICON.air, details?.amount);
        this.item.nameTag = nameTag ? nameTag : '§r';;
        this.item.setLore(details?.lore);
        this.item.lockMode = ItemLockMode.inventory;
        if (details?.pageAfterClick instanceof Page)
            this.pageAfterClick = details.pageAfterClick.name;
        else if (details?.pageAfterClick)
            this.pageAfterClick = details.pageAfterClick;
        if (typeof details?.onClickFunc === 'function')
            this.onClickFunc = details.onClickFunc;
        if (details?.updateMode)
            this.updateMode = details.updateMode;
    }
    /** 設定按鈕的點擊事件 @param onClickFunc 點擊事件回呼函式 */
    setOnClickFunc(onClickFunc) {
        checkTypes("setOnClickFunc", arguments, ['function']);
        this.onClickFunc = onClickFunc;
    }
}
