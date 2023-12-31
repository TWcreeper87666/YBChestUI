import { world, system, EntityTypes, DynamicPropertiesDefinition, Player, Vector } from '@minecraft/server';
import * as ui from '@minecraft/server-ui';
import { Entrance, Page, Button, UIerror, checkTypes, ICON, ICONR } from './exports';
const dim = world.getDimension('overworld');
var loaded = false;
var available = false;
var LARGE = false;
const PAGES = new Map();
const ENTRANCES = [];
PAGES.set('undefined', new Page('undefined', new Button(13, ' §r§l§c無權使用chestUI', { icon: 'camera' })));
/** ChestUI類別 */
export class ChestUI {
    /**
     * 建立 ChestUI 實例
     * @param homePage 主頁面名稱
     * @param isLarge 使用大介面 (預設為 false)
     * @param queryOptions 玩家目標選擇器
     * @param resetWhenLeave 玩家離線時切換至主頁 (預設為 true)
     * @param resetWhenReload reload時讓玩家回到主頁 (預設為 true)
     * @param otherEntrance 其他入口設定
     */
    constructor(homePage, isLarge, queryOptions, resetWhenLeave, resetWhenReload, ...otherEntrance) {
        /** 全部頁面的字典 */
        this.PAGES = PAGES;
        /** 入口設定陣列 */
        this.ENTRANCES = ENTRANCES;
        if (loaded)
            throw new UIerror('只能有一個 ChestUI');
        checkTypes('new ChestUI', arguments, [[Page, 'string'], 'boolean', 'object', 'boolean', 'boolean', Entrance], 1);
        ENTRANCES.push(new Entrance(homePage, queryOptions, resetWhenLeave, resetWhenReload), ...otherEntrance);
        LARGE = isLarge;
        mcInit();
        loaded = true;
    }
    /**
     * 新增入口設定
     * @param homePage 主頁面名稱
     * @param queryOptions 玩家目標選擇器
     * @param resetWhenLeave 玩家離線時切換至主頁 (預設為 true)
     * @param resetWhenReload reload時讓玩家回到主頁 (預設為 true)
     */
    addEntrance(homePage, queryOptions, resetWhenLeave, resetWhenReload) {
        checkTypes('addEntrance', arguments, [[Page, 'string'], 'object', 'boolean', 'boolean'], 1);
        ENTRANCES.push(new Entrance(homePage, queryOptions, resetWhenLeave, resetWhenReload));
    }
    /**
     * 取得玩家的 UI 實體
     * @param player 玩家實例
     * @returns UI 實體
     */
    static getUI(player) {
        ChestUI.check();
        checkTypes('getUI', arguments, [Player]);
        var entity = world.getEntity(player.getDynamicProperty('UIID'));
        if (entity?.isValid())
            return entity;
        entity = player.dimension.spawnEntity('yb:inventory', player.location);
        entity.nameTag = `YBchestUI${LARGE ? '§.' : ''}`;
        entity.setDynamicProperty('ownerID', player.id);
        player.setDynamicProperty('UIID', entity.id);
        player.setDynamicProperty('ignore', true);
        return entity;
    }
    /**
     * 使玩家退出 UI 介面
     * @param player 玩家實例
     * @param backToHomePage 是否回到主頁面
     * @param ignoreAction 關閉期間無視玩家操作
     */
    static exitUI(player, backToHomePage, ignoreAction) {
        ChestUI.check();
        checkTypes('exitUI', arguments, [Player, 'boolean', 'boolean'], 1);
        var entity = ChestUI.getUI(player);
        entity.addTag('yb:exit');
        if (ignoreAction)
            player.addTag('yb:skip');
        system.runTimeout(() => {
            entity.removeTag('yb:exit');
            player.removeTag('yb:skip');
            if (backToHomePage)
                resetPlayerPage(player);
        }, 10);
    }
    /**
     * 設定玩家的 UI 頁面
     * @param player 玩家實例
     * @param page 頁面名稱或 Page 實例
     */
    static setPlayerPage(player, page) {
        ChestUI.check();
        checkTypes('setPlayerPage', arguments, [Player, [Page, 'string']]);
        player.setDynamicProperty('ignore', true);
        player.setDynamicProperty('page', page instanceof Page ? page.name : page);
    }
    /**
     * 取得玩家的當前 UI 頁面
     * @param player 玩家實例
     * @returns 玩家當前的 UI 頁面，如果不存在則為 undefined
     */
    static getPlayerPage(player) {
        ChestUI.check();
        checkTypes('getUI', arguments, [Player]);
        return PAGES.get(player.getDynamicProperty('page'));
    }
    /**
     * 重置玩家的 UI 頁面 (回到首頁)
     * @param player 玩家實例
     * @returns 玩家重置後的 UI 頁面，如果不存在則為 undefined
     */
    static resetPlayerPage(player) {
        ChestUI.check();
        checkTypes('getUI', arguments, [Player]);
        for (const entrance of ENTRANCES) {
            if (world.getPlayers({ name: player.name, ...entrance.queryOptions })[0]) {
                ChestUI.setPlayerPage(player, entrance.homePage);
                return entrance.homePage;
            }
        }
        ChestUI.setPlayerPage(player, 'undefined');
    }
    static check() {
        if (!loaded)
            throw new UIerror('還沒有 new ChestUI');
        if (!available)
            throw new UIerror('玩家變數建立中，請在下一個 tick 執行');
    }
}
const setPlayerPage = ChestUI.setPlayerPage;
const getPlayerPage = ChestUI.getPlayerPage;
const resetPlayerPage = ChestUI.resetPlayerPage;
const getUI = ChestUI.getUI;
const exitUI = ChestUI.exitUI;
function mcInit() {
    world.afterEvents.playerSpawn.subscribe(({ initialSpawn, player }) => {
        if (!initialSpawn)
            return;
        for (const entrance of ENTRANCES) {
            if (!entrance.resetWhenLeave)
                continue;
            if (world.getPlayers({ name: player.name, ...entrance.queryOptions })[0]) {
                player.setDynamicProperty('page', entrance.homePage.name);
                player.setDynamicProperty('ignore', true);
                return;
            }
        }
        player.setDynamicProperty('page', 'undefined');
    });
    world.afterEvents.worldInitialize.subscribe((e) => {
        const player_def = new DynamicPropertiesDefinition()
            .defineNumber('pre_slot', -1)
            .defineString('page', 20, 'undefined')
            .defineBoolean('ignore', true)
            .defineString('UIID', 20, '0');
        e.propertyRegistry.registerEntityTypeDynamicProperties(player_def, EntityTypes.get('minecraft:player'));
        const entity_def = new DynamicPropertiesDefinition()
            .defineString('ownerID', 20, '0');
        e.propertyRegistry.registerEntityTypeDynamicProperties(entity_def, EntityTypes.get('yb:inventory'));
        available = true;
        dim.runCommand('tag @e[type=yb:inventory] remove yb:exit');
        dim.runCommand('tag @a remove yb:skip');
        const playerUsing = new Set();
        for (const entrance of ENTRANCES) {
            if (!entrance.resetWhenReload)
                continue;
            for (const player of world.getPlayers(entrance.queryOptions)) {
                playerUsing.add(player.name);
                setPlayerPage(player, entrance.homePage);
            }
        }
        for (const player of world.getPlayers()) {
            if (!playerUsing.has(player.name)) {
                player.setDynamicProperty('page', 'undefined');
            }
        }
        for (const entity of dim.getEntities({ type: 'yb:inventory' })) {
            const isLarge = entity.nameTag.endsWith('§.');
            if (LARGE !== isLarge)
                entity.nameTag = `YBchestUI${LARGE ? '§.' : ''}`;
        }
        system.runInterval(() => {
            update();
        });
    });
    world.beforeEvents.itemDefinitionEvent.subscribe((e) => {
        if (e.eventName !== 'yb:seek')
            return;
        e.cancel = true;
        system.run(() => {
            const UI = new ui.ActionFormData().title('§l§1可使用的UI圖示');
            for (const icon of Object.keys(ICON)) {
                if (icon in ICONR) {
                    if (icon === 'shield')
                        UI.button(icon, `textures/entity/${icon}`);
                    else
                        UI.button(icon, `textures/items/${ICONR[icon]}`);
                }
                else
                    UI.button(icon, `textures/items/${icon}`);
            }
            UI.show(e.source);
        });
    });
}
function update() {
    world.getPlayers().forEach((player) => {
        const slot = player.selectedSlot;
        const item = player.getComponent('inventory').container.getItem(slot);
        const hold = item?.typeId === 'minecraft:compass';
        if (player.getDynamicProperty('pre_slot') === slot && !hold)
            return;
        player.setDynamicProperty('pre_slot', slot);
        var entity = getUI(player);
        const pos = player.location;
        const rot = (player.getRotation().y + 90) / 180 * Math.PI;
        entity.teleport(new Vector(pos.x - Math.cos(rot) / 2, pos.y + (entity.hasTag('yb:exit') ? 10 : 0), pos.z - Math.sin(rot) / 2));
        entity.triggerEvent(`yb:${hold ? 'show' : 'hide'}`);
        if (hold)
            updateUI(player, entity);
    });
    for (const entity of dim.getEntities({ type: 'yb:inventory' })) {
        var player = world.getEntity(entity.getDynamicProperty('ownerID'));
        if (!player?.isValid())
            entity.triggerEvent('yb:kill');
    }
    for (const item of dim.getEntities({ type: 'item' })) {
        if (item.getComponent('item')?.itemStack?.typeId?.startsWith('yb:')) {
            item.kill();
        }
    }
}
function updateUI(player, entity) {
    if (player.hasTag('yb:skip')) {
        player.runCommand('function clear');
        return;
    }
    const ignore = player.getDynamicProperty('ignore');
    var page = getPlayerPage(player);
    if (!page) {
        const missingPage = player.getDynamicProperty('page');
        page = resetPlayerPage(player);
        if (page)
            throw new UIerror(`找不到${missingPage}頁面`);
    }
    const inventory = player.getComponent('inventory').container;
    const container = entity.getComponent('inventory').container;
    page.update(player, inventory, container, ignore);
    if (ignore)
        player.setDynamicProperty('ignore', false);
}
export { PAGES, ENTRANCES };
export { setPlayerPage, getPlayerPage, resetPlayerPage, getUI, exitUI };
export { Button, Page, Entrance, ICON };
