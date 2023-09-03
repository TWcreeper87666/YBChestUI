import { Player, Entity } from '@minecraft/server';
import { Entrance, Page, Button, ICON, Query } from './exports';
declare const PAGES: Map<string, Page>;
declare const ENTRANCES: Entrance[];
/** ChestUI類別 */
export declare class ChestUI {
    /** 全部頁面的字典 */
    PAGES: Map<string, Page>;
    /** 入口設定陣列 */
    ENTRANCES: Entrance[];
    /**
     * 建立 ChestUI 實例
     * @param homePage 主頁面名稱
     * @param isLarge 使用大介面 (預設為 false)
     * @param queryOptions 玩家目標選擇器
     * @param resetWhenLeave 玩家離線時切換至主頁 (預設為 true)
     * @param resetWhenReload reload時讓玩家回到主頁 (預設為 true)
     * @param otherEntrance 其他入口設定
     */
    constructor(homePage: Page | string, isLarge?: boolean, queryOptions?: Query, resetWhenLeave?: boolean, resetWhenReload?: boolean, ...otherEntrance: Entrance[]);
    /**
     * 新增入口設定
     * @param homePage 主頁面名稱
     * @param queryOptions 玩家目標選擇器
     * @param resetWhenLeave 玩家離線時切換至主頁 (預設為 true)
     * @param resetWhenReload reload時讓玩家回到主頁 (預設為 true)
     */
    addEntrance(homePage: Page | string, queryOptions?: Query, resetWhenLeave?: boolean, resetWhenReload?: boolean): void;
    /**
     * 取得玩家的 UI 實體
     * @param player 玩家實例
     * @returns UI 實體
     */
    static getUI(player: Player): Entity;
    /**
     * 使玩家退出 UI 介面
     * @param player 玩家實例
     * @param backToHomePage 是否回到主頁面
     * @param ignoreAction 關閉期間無視玩家操作
     */
    static exitUI(player: Player, backToHomePage?: boolean, ignoreAction?: boolean): void;
    /**
     * 設定玩家的 UI 頁面
     * @param player 玩家實例
     * @param page 頁面名稱或 Page 實例
     */
    static setPlayerPage(player: Player, page: Page | string): void;
    /**
     * 取得玩家的當前 UI 頁面
     * @param player 玩家實例
     * @returns 玩家當前的 UI 頁面，如果不存在則為 undefined
     */
    static getPlayerPage(player: Player): Page | undefined;
    /**
     * 重置玩家的 UI 頁面 (回到首頁)
     * @param player 玩家實例
     * @returns 玩家重置後的 UI 頁面，如果不存在則為 undefined
     */
    static resetPlayerPage(player: Player): Page | undefined;
    private static check;
}
declare const setPlayerPage: typeof ChestUI.setPlayerPage;
declare const getPlayerPage: typeof ChestUI.getPlayerPage;
declare const resetPlayerPage: typeof ChestUI.resetPlayerPage;
declare const getUI: typeof ChestUI.getUI;
declare const exitUI: typeof ChestUI.exitUI;
export { PAGES, ENTRANCES };
export { setPlayerPage, getPlayerPage, resetPlayerPage, getUI, exitUI };
export { Button, Page, Entrance, ICON };
