import { PAGES } from './ChestUI';
import { Page, checkTypes } from './exports';
/** 入口設定類別 */
export class Entrance {
    /**
     * 建立 Entrance 實例
     * @param homePage 主頁面名稱
     * @param queryOptions 玩家目標選擇器
     * @param resetWhenLeave 玩家離線時切換至主頁 (預設為 true)
     * @param resetWhenReload reload時讓玩家回到主頁 (預設為 true)
     */
    constructor(homePage, queryOptions, resetWhenLeave = true, resetWhenReload = true) {
        checkTypes('new Entrance', arguments, [[Page, 'string'], 'object', 'boolean', 'boolean'], 1);
        if (homePage instanceof Page)
            this.homePage = homePage;
        else if (PAGES.has(homePage))
            this.homePage = PAGES.get(homePage);
        else
            this.homePage = new Page(homePage);
        if (queryOptions)
            this.queryOptions = queryOptions;
        this.resetWhenLeave = resetWhenLeave;
        this.resetWhenReload = resetWhenReload;
    }
}
