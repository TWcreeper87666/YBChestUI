import { world, system, EntityTypes, DynamicPropertiesDefinition, Player } from '@minecraft/server';
import * as mc from '@minecraft/server';
import { Button, ICON } from './Button';
import { Page } from './Page';

const dim = world.getDimension('overworld');

let loaded = false;
let available = false;

const ChestUIs: ChestUI[] = [];

type Inventory = mc.EntityInventoryComponent;
type Query = mc.EntityQueryOptions

class UIerror extends Error {
    constructor(name: string) {
        super();
        this.name = name;
        const source: string[] = [];
        if (!this.stack) return;
        for (const line of this.stack.split('\n')) {
            if (line && !line.includes('YBchestUI')) source.push(line);
        }
        this.stack = source.join('\n');
        world.sendMessage(`§l§cERROR: ${this.name}`);
    }
}

/** ChestUI類別 */
export class ChestUI {
    /** 玩家離線時切換至主頁 (預設為 true) */
    resetWhenLeave = true;
    /** 全部頁面的字典 */
    pages: Map<string, Page> = new Map();
    /** 主頁面 */
    homePage: Page;
    /** 玩家開啟 UI 的條件 */
    target: Query;

    /**
     * 建立 ChestUI 實例
     * @param homePage 主頁面 (使用文字會建立一個空的頁面)
     * @param target 設置玩家開啟 UI 的條件
     * @returns 新建的 ChestUI 實例
     */
    constructor(homePage: Page | string, target?: Query, resetWhenLeave?: boolean) {
        if (homePage instanceof Page) {
            this.addPage(homePage);
        } else {
            this.homePage = this.newPage(homePage);
        }

        this.target = target;
        this.resetWhenLeave = !resetWhenLeave;

        ChestUIs.push(this);

        if (!loaded) {
            mcSetting();
            loaded = true;
        }
    }

    /** 加入頁面 @param Page 要加入的頁面 */
    addPage(...Page: Page[]): ChestUI {
        for (const page of Page) {
            this.pages.set(page.name, page);
        }
        return this;
    }

    /**
     * 創建新頁面
     * @param name 頁面名稱
     * @param button 頁面中的按鈕
     * @returns 新建的 Page 實例
     */
    newPage(name: string, ...button: Button[]): Page {
        const page = new Page(name, ...button);
        this.pages.set(name, page);
        return page;
    }

    /**
     * 取得指定名稱的頁面
     * @param name 頁面名稱
     * @returns 指定名稱的 Page 實例，如果不存在則為 undefined
     */
    getPage(name: string): Page | undefined {
        return this.pages.get(name);
    }

    /**
     * 使玩家退出 UI 介面
     * @param player 玩家實例
     * @param backToHomePage 是否回到主頁面
     * @returns 是否成功退出 UI
     */
    exitUI(player: Player, backToHomePage: boolean): boolean {
        ChestUI.check();
        const chestUI = dim.getEntities({ type: 'yb:inventory', name: `${player.name}'s chestUI` })[0];
        if (!chestUI) return false;
        chestUI.addTag('exit');
        system.runTimeout(() => {
            chestUI.removeTag('exit');
            if (backToHomePage) {
                player.setDynamicProperty('ignore', true);
                player.setDynamicProperty('page', this.homePage.name);
            }
        }, 5);
        return true;
    }

    /**
     * 設定玩家的 UI 頁面
     * @param player 玩家實例
     * @param page 頁面名稱或 Page 實例
     */
    static setPlayerPage(player: Player, page: string | Page): void {
        ChestUI.check();
        player.setDynamicProperty('page', page instanceof Page ? page.name : page);
        player.setDynamicProperty('ignore', true);
    }

    /**
     * 取得玩家的當前 UI 頁面
     * @param player 玩家實例
     * @returns 玩家當前的 UI 頁面名稱
     */
    static getPlayerPage(player: Player): string {
        ChestUI.check();
        return player.getDynamicProperty('page') as string;
    }

    private static check(): void {
        if (!loaded) throw new UIerror('還沒有 new ChestUI');
        if (!available) throw new UIerror('玩家變數建立中，請在下一個 tick 執行');
    }
}

function mcSetting() {
    world.afterEvents.playerSpawn.subscribe((e) => {
        if (e.initialSpawn) {
            for (const chestUI of ChestUIs) {
                if (chestUI.resetWhenLeave && world.getPlayers({ name: e.player.name, ...chestUI.target })) {
                    e.player.setDynamicProperty('page', chestUI.homePage.name);
                }
                e.player.setDynamicProperty('ignore', true);
            }
        }
    });

    world.afterEvents.worldInitialize.subscribe((e) => {
        const player_def = new DynamicPropertiesDefinition()
            .defineNumber('pre_slot', -1)
            .defineString('page', 30, 'None')
            .defineBoolean('ignore', true);

        e.propertyRegistry.registerEntityTypeDynamicProperties(
            player_def,
            EntityTypes.get('minecraft:player')
        );

        const inventory_def = new DynamicPropertiesDefinition().defineBoolean('idle');
        e.propertyRegistry.registerEntityTypeDynamicProperties(
            inventory_def,
            EntityTypes.get('yb:inventory')
        );

        available = true;

        dim.runCommand('tag @e[type=yb:inventory] remove exit');

        for (const chestUI of ChestUIs) {
            for (const player of world.getPlayers(chestUI.target)) {
                ChestUI.setPlayerPage(player, chestUI.homePage);
            }
        }

        system.runInterval(() => {
            for (const chestUI of ChestUIs) {
                updateUI(chestUI);
                updateChest(chestUI);
            }
        });
    });
}

function updateChest(chestUI: ChestUI): void {
    world.getPlayers(chestUI.target).forEach((p) => {
        const slot = p.selectedSlot;
        const item = (p.getComponent('inventory') as Inventory).container.getItem(slot);
        const hold = item?.typeId === 'minecraft:compass';

        if (p.getDynamicProperty('pre_slot') === slot && !hold) return;

        p.setDynamicProperty('pre_slot', slot);
        const chestUIEntity = dim.getEntities({ type: 'yb:inventory', name: `${p.name}'s chestUI` })[0];

        if (chestUIEntity) {
            const pos = p.location;
            const rot = (p.getRotation().y + 90) / 180 * Math.PI;
            pos.x -= Math.cos(rot) / 2;
            pos.z -= Math.sin(rot) / 2;
            pos.y += chestUIEntity.hasTag('exit') ? 10 : 0;
            chestUIEntity.teleport(pos);
            chestUIEntity.triggerEvent(`yb:${hold ? 'show' : 'hide'}`);
            chestUIEntity.setDynamicProperty('idle', !hold);
        } else if (hold) {
            p.runCommand(`summon yb:inventory "${p.name}'s chestUI"`);
        }
    });
}

function updateUI(chestUI: ChestUI): void {
    dim.getEntities({ type: 'yb:inventory' }).forEach((i) => {
        if (i.getDynamicProperty('idle')) return;

        const player = world.getPlayers(chestUI.target).find((p) => i.nameTag.startsWith(p.name));

        if (!player) {
            i.triggerEvent('yb:kill');
            return;
        }

        const ignore = player.getDynamicProperty('ignore') as boolean;
        const pageName = ChestUI.getPlayerPage(player);
        const page = chestUI.pages.get(pageName);

        if (!page) {
            player.setDynamicProperty('page', chestUI.homePage.name);
            throw new UIerror(`找不到${pageName}頁面`);
        }
        const inventory = (player.getComponent('inventory') as Inventory).container;
        const container = (i.getComponent('inventory') as Inventory).container;

        page.update(player, inventory, container, ignore);

        if (ignore) player.setDynamicProperty('ignore', false);
    });
}

const setPlayerPage = ChestUI.setPlayerPage;
const getPlayerPage = ChestUI.getPlayerPage;

export { Button, Page, ICON, setPlayerPage, getPlayerPage };
