import { ItemStack } from '@minecraft/server';
import { ButtonClickCallback, ButtonDetails, Page } from './exports';
/** 按鈕類別 */
export declare class Button {
    /** 按鈕的欄位 */
    slot: number;
    /** 按鈕的物品 */
    item: ItemStack;
    /** 點擊後頁面*/
    pageAfterClick: string | Page;
    /** 按鈕點擊事件的函式 */
    onClickFunc: ButtonClickCallback;
    /** 按鈕更新模式 */
    updateMode: string;
    /**
     * 建構子
     * @param slot 按鈕的欄位
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊 (icon, lore, amount, pageAfterClick, onClickFunc, updateMode)
     * @returns 新建的 Button 實例
     */
    constructor(slot: number, nameTag: string, details?: ButtonDetails);
    /** 設定按鈕的點擊事件 @param onClickFunc 點擊事件回呼函式 */
    setOnClickFunc(onClickFunc: ButtonClickCallback): void;
}
