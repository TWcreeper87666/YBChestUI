import { ItemStack, ItemLockMode } from '@minecraft/server';
/** 圖示名稱枚舉 */
export const ICON = {
    button: 'yb:button',
    label: 'yb:label',
    bg: 'yb:bg'
};
/** 按鈕類別 */
export class Button {
    /**
     * 建構子
     * @param slot - 按鈕的欄位
     * @param nameTag - 名稱標籤
     * @param details - 額外的詳細資訊
     * @returns 新建的 Button 實例
     */
    constructor(slot, nameTag, details) {
        this.slot = slot;
        this.item = new ItemStack(details?.icon ? ICON[details.icon] : ICON.button, details?.amount);
        this.item.nameTag = nameTag;
        this.item.setLore(details?.lords);
        this.item.lockMode = ItemLockMode.inventory;
        if (typeof details?.onClickFunc === 'function')
            this.onClickFunc = details.onClickFunc;
    }
    /** 設定按鈕的點擊事件 @param onClickFunc - 點擊事件回呼函式 */
    setOnClickFunc(onClickFunc) {
        this.onClickFunc = onClickFunc;
    }
}
