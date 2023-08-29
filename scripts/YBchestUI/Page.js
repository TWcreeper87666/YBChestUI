import { Button } from './Button';
/** 頁面類別 */
export class Page {
    /**
     * 建立新頁面
     * @param name 頁面名稱
     * @param button 頁面中的按鈕
     * @returns 新建的 Page 實例
     */
    constructor(name, ...button) {
        /** 全部按鈕的字典 */
        this.buttons = new Map();
        this.name = name;
        for (const btn of button)
            this.buttons.set(btn.slot, btn);
    }
    /** 新增按鈕到頁面 @param button 要新增的按鈕 */
    addButton(...button) {
        for (const btn of button)
            this.buttons.set(btn.slot, btn);
        return this;
    }
    /**
     * 範圍新增按鈕到頁面
     * @param from 從
     * @param to 至
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     */
    rangeButton(from, to, nameTag, details) {
        for (let i = from; i <= to; i++) {
            this.newButton(i, nameTag, details);
        }
        return this;
    }
    /**
     * 新建按鈕並加入到頁面
     * @param slot 按鈕的欄位
     * @param nameTag 名稱標籤
     * @param details 額外的詳細資訊
     * @returns 新建的 Button 實例
     */
    newButton(slot, nameTag, details) {
        const button = new Button(slot, nameTag, details);
        this.buttons.set(slot, button);
        return button;
    }
    /** 移除指定按鈕 @param buttonSlot 要移除的按鈕欄位或按鈕實例 */
    removeButton(...buttonSlot) {
        for (const btnSlot of buttonSlot) {
            this.buttons.delete(btnSlot instanceof Button ? btnSlot.slot : btnSlot);
        }
        return this;
    }
    /** 清空所有按鈕 */
    clearButton() {
        this.buttons.clear();
        return this;
    }
    /**
     * 更新頁面的按鈕(這是給系統跑的)
     * @param player 玩家實例
     * @param inventory 玩家的背包
     * @param container 容器
     * @param ignore 是否忽略更新
     */
    update(player, inventory, container, ignore) {
        if (ignore) {
            for (let slot = 0; slot < 27; slot++)
                container.transferItem(slot, inventory);
        }
        for (const [slot, button] of this.buttons) {
            const slotItem = container.getItem(slot);
            if (slotItem && slotItem.isStackableWith(button.item))
                continue;
            player.runCommand('clear @s yb:button');
            player.runCommand('clear @s yb:label');
            player.runCommand('clear @s yb:bg');
            container.transferItem(slot, inventory);
            container.setItem(slot, button.item);
            if (ignore)
                continue;
            if (button.onClickFunc) {
                button.onClickFunc({ player, inventory, container, button });
            }
        }
    }
}
