import { ItemStack, Player, Container } from '@minecraft/server';
import { Page } from './Page';
import { ICON } from './items';
/**
 * 按鈕點擊事件的回呼函式型別
 * @param arg 回呼函式的參數
 */
type ClickCallback = (arg: {
    /** 觸發事件的玩家 */
    player: Player;
    /** 玩家的背包 */
    inventory: Container;
    /** 按鈕所在的容器 */
    container: Container;
    /** 被點擊的按鈕 */
    button: Button;
}) => void;
export declare enum UpdateMode {
    all = "all",
    air = "air",
    icon = "icon"
}
export type Details = {
    icon?: keyof typeof ICON;
    /** 按鈕的描述 */
    lords?: string[];
    /** 物品的數量 */
    amount?: number;
    /** 點擊後切換至頁面 */
    pageAfterClick?: string | Page;
    /** 按鈕的點擊事件 */
    onClickFunc?: ClickCallback;
    /**
     * 點擊事件更新模式 (預設為 all)
     * @all 物品改變時更新
     * @icon 物品圖示改變時更新 (typeId)
     * @air 物品變成空氣時更新
     */
    updateMode?: keyof typeof UpdateMode;
};
/** 按鈕類別 */
export declare class Button {
    /** 按鈕的欄位 */
    slot: number;
    /** 按鈕的物品 */
    item: ItemStack;
    /** 點擊後頁面*/
    pageAfterClick: string | Page;
    /** 按鈕點擊事件的函式 */
    onClickFunc: ClickCallback;
    /** 按鈕更新模式 */
    updateMode: string;
    /**
     * 建構子
     * @param slot 按鈕的欄位
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     * @returns 新建的 Button 實例
     */
    constructor(slot: number, nameTag: string, details?: Details);
    /** 設定按鈕的點擊事件 @param onClickFunc 點擊事件回呼函式 */
    setOnClickFunc(onClickFunc: ClickCallback): void;
}
export {};
