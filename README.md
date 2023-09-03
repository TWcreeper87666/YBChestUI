# YBChestUI
Minecraft Bedrock Editition API.

## 方法參考
https://github.com/Smelly-API/Smelly-API

## 前言
* 箱子大小只能一開始設定 (ui太難搞了)  
* 記得關掉showtags不然會很醜
* 私人頁面不知怎麼搞比較好,有需求可以自己用onClickFunc做
* 一些類型可以用'或者"來查看裡面的內容
* items請自行解壓縮lol
* 使用字典儲存(按鈕、頁面),同名會被取代

## 物品
指南針: 開啟介面,第一次要養他喔! (請以領養代替購買)  
查看可用圖示(yb:seek): 顯示可用的按鈕圖示 (暴力製作XD)

## ChestUI class
創建你的chestUI! (只能有一個實例)  
```javascript
import { ChestUI, Page, Button } from './YBchestUI/ChestUI';
const chestUI = new ChestUI('home');
```

## Page class
建立頁面後會自動存入PAGES
```js
const home_page = new Page('home');
```

## Button class
創建按鈕 (記得放進page裡)
```js
const home_btn = new Button(0, '回首頁', { icon: 'bed', pageAfterClick: 'home' })
```

## static method
一些方法可以導入 (或者直接從ChestUI拿)
```js
import { setPlayerPage, getPlayerPage, resetPlayerPage, getUI, exitUI } from './YBchestUI/ChestUI';
```

## 使用教學
[點我查看](https://youtu.be/dQw4w9WgXcQ?si=yfSQVoKE8ZNUw4Wg)
