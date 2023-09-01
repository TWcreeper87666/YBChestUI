import { Player, Container } from '@minecraft/server';
import { Button, Details } from './Button';
import { PAGES, setPlayerPage } from './ChestUI';

/** 按鈕的詳細資訊型別 */
type Range = {
    /** 從 */
    from: number
    /** 到 */
    to: number
    /** 間隔 */
    step?: number
    /** 其他 */
    others?: number[]
};

/** 頁面類別 */
export class Page {
    /** 頁面名稱 */
    name: string;
    /** 全部按鈕的字典 */
    buttons: Map<number, Button> = new Map();

    /**
     * 建立新頁面 (自動存入 PAGES)
     * @param name 頁面名稱
     * @param button 頁面中的按鈕
     * @returns 新建的 Page 實例
     */
    constructor(name: string, ...button: Button[]) {
        this.name = name;
        for (const btn of button) this.buttons.set(btn.slot, btn);
        PAGES.set(name, this);
    }

    /** 新增按鈕到頁面 @param button 要新增的按鈕 */
    addButton(...button: Button[]): Page {
        for (const btn of button) this.buttons.set(btn.slot, btn);
        return this;
    }

    /**
     * 範圍新增按鈕到頁面
     * @param range 範圍
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     */
    sameButton(range: Range, nameTag: string, details?: Details) {
        const step = range?.step ? range.step : 1;
        for (let i = range.from; i <= range.to; i += step) {
            this.newButton(i, nameTag, details);
        }
        if (range?.others) {
            for (let i of range.others) {
                this.newButton(i, nameTag, details);
            }
        }
        return this;
    }

    /**
     * 新建按鈕並加入到頁面
     * @param slot 按鈕的欄位
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     */
    newButton(slot: number, nameTag: string, details?: Details): Page {
        const button = new Button(slot, nameTag, details);
        this.buttons.set(slot, button);
        return this;
    }

    /** 移除指定按鈕 @param buttonSlot 要移除的按鈕欄位或按鈕實例 */
    removeButton(...buttonSlot: (number | Button)[]): Page {
        for (const btnSlot of buttonSlot) {
            this.buttons.delete(btnSlot instanceof Button ? btnSlot.slot : btnSlot);
        }
        return this;
    }

    /**
     * 更新頁面的按鈕(這是給系統跑的)
     * @param player 玩家實例
     * @param inventory 玩家的背包
     * @param container 容器
     * @param ignore 是否忽略更新
     */
    update(player: Player, inventory: Container, container: Container, ignore: boolean): void {
        if (ignore) {
            for (let slot = 0; slot < 54; slot++) {
                safeTransfer(player, inventory, container, slot);
            }
            player.runCommand("give @s yb:air"); // debug
        }
        for (const [slot, button] of this.buttons) {
            const slotItem = container.getItem(slot);
            const sameTypeId = slotItem?.typeId === button.item.typeId;

            switch (button.updateMode) {
                case "icon":
                    if (sameTypeId) continue;
                case "air":
                    if (slotItem) continue;
                case "all":
                    if (slotItem?.isStackableWith(button.item)) continue;
            }

            safeTransfer(player, inventory, container, slot);
            player.runCommand("function clear");
            container.setItem(slot, button.item);

            if (ignore) continue;
            if (button.pageAfterClick) {
                setPlayerPage(player, button.pageAfterClick);
            }
            if (button.onClickFunc) {
                button.onClickFunc({ player, inventory, container, button });
            }
        }
    }
}

function safeTransfer(player: Player, inventory: Container, container: Container, slot: number) {
    const item = container.getItem(slot);
    if (!item) return;
    if (item.typeId.startsWith("yb:")) {
        container.setItem(slot);
    } else {
        container.transferItem(slot, inventory);
        if (container.getItem(slot)) {
            container.setItem(slot);
            player.dimension.spawnItem(item, player.location);
        }
    }
}