import { ItemStack, Player, Container, ItemLockMode } from '@minecraft/server';

/** 圖示名稱枚舉 */
export const ICON = {
    button: 'yb:button',
    label: 'yb:label',
    bg: 'yb:bg'
};

/**
 * 按鈕點擊事件的回呼函式型別
 * @param arg - 回呼函式的參數
 */
type ButtonClickCallback = (arg: {
    /** 觸發事件的玩家 */
    player: Player;
    /** 玩家的背包 */
    inventory: Container;
    /** 按鈕所在的容器 */
    container: Container;
    /** 被點擊的按鈕 */
    button: Button;
}) => void;

/** 按鈕的詳細資訊型別 */
export type ButtonDetails = {
    /** 按鈕的圖示 */
    icon?: keyof typeof ICON;
    /** 按鈕的描述 */
    lords?: string[];
    /** 按鈕的數量 */
    amount?: number;
    /** 按鈕的點擊事件 */
    onClickFunc?: ButtonClickCallback;
};

/** 按鈕類別 */
export class Button {
    /** 按鈕的欄位 */
    slot: number;
    /** 按鈕的物品 */
    item: ItemStack;
    /** 按鈕點擊事件的函式 */
    onClickFunc?: ButtonClickCallback;

    /**
     * 建構子
     * @param slot - 按鈕的欄位
     * @param nameTag - 名稱標籤
     * @param details - 額外的詳細資訊
     * @returns 新建的 Button 實例
     */
    constructor(slot: number, nameTag: string, details?: ButtonDetails) {
        this.slot = slot;
        this.item = new ItemStack(details?.icon ? ICON[details.icon] : ICON.button, details?.amount);
        this.item.nameTag = nameTag;
        this.item.setLore(details?.lords);
        this.item.lockMode = ItemLockMode.inventory;
        if (typeof details?.onClickFunc === 'function') this.onClickFunc = details.onClickFunc;
    }

    /** 設定按鈕的點擊事件 @param onClickFunc - 點擊事件回呼函式 */
    setOnClickFunc(onClickFunc: ButtonClickCallback): void {
        this.onClickFunc = onClickFunc;
    }
}
