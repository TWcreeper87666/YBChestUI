import { Page, Query } from './exports';
/** 入口設定類別 */
export declare class Entrance {
    /** 主頁面名稱 */
    homePage: Page;
    /** 玩家目標選擇器 */
    queryOptions: Query;
    /** 玩家離線時切換至主頁 */
    resetWhenLeave: boolean;
    /** reload時讓玩家回到主頁 */
    resetWhenReload: boolean;
    /**
     * 建立 Entrance 實例
     * @param homePage 主頁面名稱
     * @param queryOptions 玩家目標選擇器
     * @param resetWhenLeave 玩家離線時切換至主頁 (預設為 true)
     * @param resetWhenReload reload時讓玩家回到主頁 (預設為 true)
     */
    constructor(homePage: Page | string, queryOptions?: Query, resetWhenLeave?: boolean, resetWhenReload?: boolean);
}
