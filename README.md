# 微信小程序开发框架xupy文档

## 快速入门指南

### xupy项目的创建与使用

xupy项目的创建与使用的安装或更新都通过`npm`进行。

**全局安装或更新WePY命令行工具**

```bash
$ install xupy-cli -g
```

**在开发目录中生成Demo开发项目**

```bash
$ xupy init xupy-demo myproject
```

**切换至项目目录**

```bash
$ cd myproject
```

**开启实时编译**

```bash
$ xupy build --watch
```
使用开发者工具选定dist目录预览
```bash
$ npm i xupy -S --production
```
选择开发者工具->顶部工具->构建npm就好

### xupy项目的目录结构

```
├── dist
|   ├── node_modules       小程序npm包  
|   ├── miniprogram_npm    小程序npm构建后的包
|   |   ├── xupy           xupy项目运行核心文件
|   └── package.json       项目的package配置          
├── src                    代码编写的目录（该目录为使用xupy后的开发目录）
|   ├── components         xupy组件目录（组件不属于完整页面，仅供完整页面或其他组件引用）
|   |   ├── a.xu           可复用的xupy组件a
|   |   └── b.xu           可复用的xupy组件b
|   ├── pages              xupy页面目录（属于完整页面）
|   |   ├── index.xu       index页面（经build后，会在dist目录下的pages目录生成index.js、index.json、index.wxml和index.wxss文件）
|   |   └── other.xu       other页面（经build后，会在dist目录下的pages目录生成other.js、other.json、other.wxml和other.wxss文件）
|   └── app.wpy            小程序配置项（全局数据、样式、声明钩子等；经build后，会在dist目录下生成app.js、app.json和app.wxss文件）

```


## 用法
### 说明(用法)
#### 入口文件(app.xu)
```javascript
<style lang="less" src="./less/index.less"></style>
<script>
  import xupy from 'xupy/index'
  import regeneratorRuntime from './compile/runtime'

  export default class extends xupy.app{
    config = {
      "pages": [
        "pages/index/index"
      ],
      "window": {
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTitleText": "kai-ui",
        "navigationBarTextStyle": "black",
        "backgroundTextStyle": "dark",
        "backgroundColor": "#f5f5f5"
      },
      "debug": true
    }

    globalData = {
      name: 'chaunjie'
    }
    
    test (data) {
      console.log(data)
    }

    constructor () {
      super()
    }

    sleep (s) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('promise resolved')
        }, s * 1000)
      })
    }

    async testAsync () {
      const data = await this.sleep(3)
      console.log(data)
    }


    onLaunch (e) {
      console.log(e)
      this.testAsync()
    }
  }
</script>
```

#### 页面(xxx.xu)
```javascript
<style>
  .container{
    background-color: orange;
  }
  .test {
    color: orange;
  }
</style>
<style lang="less" src="../../less/index.less"></style>
<template>
  <view bindtap="tapPro" class="padding">点击更新组件信息组件</view>
  <k-test text="{{name}}" bind:select="select" custom-class="test"></k-test>
  <view bindtap="doAwait">点击测试await方法</view>
  <view>{{syncItem}}</view>
</template>
<script>
  import xupy from 'xupy/index'
  import regeneratorRuntime from '../../compile/runtime'

  export default class Index extends xupy.page{
    config = {
      "navigationBarTitleText": "首页",
      "usingComponents": {
        "k-test": "../../components/test/index"
      }
    }

    data = {
      name: 'chaunjie',
      syncItem: '这个是异步初始化数据'
    }

    methods = {
      select (e) {
        console.log('组件传回的值:' + e.detail)
      }
    }

    onLoad () {
      this.setData({
        name: '组件初始化数据'
      })
      setTimeout(() => {
        this.$parent.globalData.name = '这是全局数据'
        console.log(this.data)
      }, 3000)
    }

    sleep (s) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('异步数据拿到')
        }, s * 1000)
      })
    }

    async testAsync () {
      const data = await this.sleep(3)
      this.setData({syncItem: data})
    }

    doAwait () {
      this.testAsync()
    }

    tapPro (e) {
      this.setData({name: '组件更新信息后显示'})
      // wx.navigateTo({url: '../test/index'})
    }
  }
</script>
```

### 组件(xxx.xu)
```javascript
<template>
  <view class="custom-class" bindtap="tap" data-index="{{tag}}">{{text}}</view>
</template>
<script>
  import xupy from 'xupy/index'
  export default class Test extends xupy.component{
    config = {
      "component": true
    }

    externalClasses = ['custom-class']

    options = {
      multipleSlots: true
    }

    properties = {
      text: {
        type: String,
        value: '99999'
      }
    }

    data = {
      tag: 'abc'
    }

    methods = {
      test () {
        console.log(99999)
      },
      tap (e) {
        console.log(e)
        const dataset = e.currentTarget.dataset
        this.doSelect.call(this, dataset.index);
      },
      doSelect (res) {
        this.triggerEvent('select', res);
      }
    }

    ready () {
      this.setData({tag: 'tapd'})
      console.log('component')
    }
  }
</script>
```

