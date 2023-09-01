import { Player, Container } from '@minecraft/server';
import { Button, Details } from './Button';
/** 按鈕的詳細資訊型別 */
type Range = {
    /** 從 */
    from: number;
    /** 到 */
    to: number;
    /** 間隔 */
    step?: number;
    /** 其他 */
    others?: number[];
};
/** 頁面類別 */
export declare class Page {
    /** 頁面名稱 */
    name: string;
    /** 全部按鈕的字典 */
    buttons: Map<number, Button>;
    /**
     * 建立新頁面 (自動存入 PAGES)
     * @param name 頁面名稱
     * @param button 頁面中的按鈕
     * @returns 新建的 Page 實例
     */
    constructor(name: string, ...button: Button[]);
    /** 新增按鈕到頁面 @param button 要新增的按鈕 */
    addButton(...button: Button[]): Page;
    /**
     * 範圍新增按鈕到頁面
     * @param range 範圍
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     */
    sameButton(range: Range, nameTag: string, details?: Details): this;
    /**
     * 新建按鈕並加入到頁面
     * @param slot 按鈕的欄位
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     */
    newButton(slot: number, nameTag: string, details?: Details): Page;
    /** 移除指定按鈕 @param buttonSlot 要移除的按鈕欄位或按鈕實例 */
    removeButton(...buttonSlot: (number | Button)[]): Page;
    /**
     * 更新頁面的按鈕(這是給系統跑的)
     * @param player 玩家實例
     * @param inventory 玩家的背包
     * @param container 容器
     * @param ignore 是否忽略更新
     */
    update(player: Player, inventory: Container, container: Container, ignore: boolean): void;
}
export {};
