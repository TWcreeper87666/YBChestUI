import { Vector, ItemStack } from '@minecraft/server'
import { ChestUI, Page, Button, exitUI } from './YBchestUI/ChestUI'

new ChestUI('home')

const home_btn = new Button(0, '回首頁', { icon: 'bed', pageAfterClick: 'home' })

new Page('home')
    .newButton(13, '進入', { icon: 'acacia_door', pageAfterClick: 'menu' })
    .sameButton({ from: 0, to: 9 }, '背景', { icon: 'camera' })
    .sameButton({ from: 17, to: 26 }, '背景', { icon: 'camera' })

new Page('menu',
    home_btn,
    new Button(11, '傳送至大廳', {
        icon: 'ender_pearl', onClickFunc(v) {
            exitUI(v.player, true, true)
            v.player.teleport(new Vector(0.5, -60, 0.5))
            v.player.playSound('mob.endermen.portal')
        }
    }),
    new Button(13, '播放音效', {
        icon: 'goat_horn', onClickFunc(v) {
            v.player.playSound('mob.enderdragon.growl')
        }
    }),
    new Button(15, '獲得食物', {
        icon: 'beef_cooked', onClickFunc(v) {
            v.inventory.addItem(new ItemStack('minecraft:cooked_beef', 1))
            v.player.playSound('random.orb')
        }
    })
)