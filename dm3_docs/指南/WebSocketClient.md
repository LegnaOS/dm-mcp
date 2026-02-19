# WebSocketClient

## 介绍

- WebSocket客户端组件。
- 自动重连。
- 推荐使用阿里云云函数。

```
local 组件配置 = {
	类型 = "WebSocketClient",
 名称 = "WS客户端",
	地址 = "ws://xxxxxxxxxxxxxx",
 系统事件 = {
 创建 = function(客户端)

 end,

 连接 = function(客户端)
 调试输出("连接")
 end,

 消息 = function(客户端,内容)
 调试输出("消息",内容)
 end,

 断开 = function(客户端)
 调试输出("断开")
 end,
 }
}

return 组件配置

```

```
const WebSocket = require('ws');

const WebSocketServer = WebSocket.Server;

const wss = new WebSocketServer({
 host: "0.0.0.0",
 port: 9000,
});

wss.on('connection', function (ws, req) {
 console.log(`[SERVER] connection()`);

 ws.on('close', function () {
 console.log(`[SERVER] close()`);
 });

 ws.on('message', function (message) {
 console.log(`[SERVER] message: ${message}`);
 ws.send(`${message}`);
 })

});

```

## 配置项

| 名称 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| 类型 | 文本 | true | 固定值： WebSocketClient 表示这是一个WebSocketClient组件 |
| 名称 | 文本 | true | 全局唯一标识 |
| 地址 | 文本 | false | 服务端Url地址 |
| 系统事件 | table | false | |

## 方法

### 连接

连接

说明：连接到服务端。

参数名称 值的类型 是否必填 说明描述 url 文本 false 服务端地址 ws:// wss:// headers table {k,v} false 自定义header 示例 `local 结果 = self.客户端.连接()`

local headers = {}
headers["authorization"] = "abc123"; -- 例如认证头
self.客户端.连接(nil,headers)
//nodejs 服务端
wss.on('connection', function (ws, req) {

 const authHeader = req.headers['authorization'];
 if (!authHeader) {
 console.log(`[SERVER] 拒绝连接: 缺少认证信息`);
 ws.close();
 return;
 }
 console.log(`[SERVER] authHeader ${authHeader}`);

 const isSecure = req.socket.encrypted || (req.headers['x-forwarded-proto'] === 'https');
 console.log(`[${isSecure ? 'WSS' : 'WS'}] 新连接来自 ${req.socket.remoteAddress}`);

 ws.on('close', function () {
 console.log(`[SERVER] close()`);
 });

 ws.on('message', function (message) {
 ws.send(`${message}`);
 })
});

| 返回值 | 值的类型 | 说明描述 |
| --- | --- | --- |
| 是否成功 | 逻辑 | |

| 参数名称 | 值的类型 | 是否必填 | 说明描述 |
| --- | --- | --- | --- |
| url | 文本 | false | 服务端地址 ws:// wss:// |
| headers | table {k,v} | false | 自定义header |

## 示例

```
local 结果 = self.客户端.连接()

local headers = {}
headers["authorization"] = "abc123"; -- 例如认证头
self.客户端.连接(nil,headers)

```

```
//nodejs 服务端
wss.on('connection', function (ws, req) {

 const authHeader = req.headers['authorization'];
 if (!authHeader) {
 console.log(`[SERVER] 拒绝连接: 缺少认证信息`);
 ws.close();
 return;
 }
 console.log(`[SERVER] authHeader ${authHeader}`);

 const isSecure = req.socket.encrypted || (req.headers['x-forwarded-proto'] === 'https');
 console.log(`[${isSecure ? 'WSS' : 'WS'}] 新连接来自 ${req.socket.remoteAddress}`);

 ws.on('close', function () {
 console.log(`[SERVER] close()`);
 });

 ws.on('message', function (message) {
 ws.send(`${message}`);
 })
});

```

| 返回值 | 值的类型 | 说明描述 |
| --- | --- | --- |
| 是否成功 | 逻辑 | |

### 发送

发送

说明：发送消息到服务端。

参数名称 值的类型 是否必填 说明描述 内容 文本 false 必须文本型 示例 `self.客户端.发送("你好,我来自地球~~")`

local 消息 = {
	命令 = 1000,
	金币 = 200
}

self.客户端.发送(table.tojson(消息))

| 参数名称 | 值的类型 | 是否必填 | 说明描述 |
| --- | --- | --- | --- |
| 内容 | 文本 | false | 必须文本型 |

## 示例

```
self.客户端.发送("你好,我来自地球~~")

local 消息 = {
	命令 = 1000,
	金币 = 200
}

self.客户端.发送(table.tojson(消息))

```

### 断开

断开

说明：主动断开与服务端的连接。

示例 `self.客户端.断开() `

## 示例

```
self.客户端.断开()

```

## 系统事件

### 🔹 创建

创建时触发

| 回调参数 | 类型 | 说明描述 |
| --- | --- | --- |
| 客户端 | WebSocketClient对象 | |

## 示例

```
系统事件 = {
 创建 = function(客户端)

 end,
}

```

### 🔹 连接

成功连接到服务端时触发

| 回调参数 | 类型 | 说明描述 |
| --- | --- | --- |
| 客户端 | WebSocketClient对象 | |

## 示例

```
系统事件 = {
 连接 = function(客户端)

 end,
}

```

### 🔹 消息

接收到服务端消息时触发

| 回调参数 | 类型 | 说明描述 |
| --- | --- | --- |
| 客户端 | WebSocketClient对象 | |
| 内容 | 文本 | |

## 示例

```
系统事件 = {
 消息 = function(客户端,内容)

 end,
}

```

### 🔹 断开

与服务端断开连接时触发

| 回调参数 | 类型 | 说明描述 |
| --- | --- | --- |
| 客户端 | WebSocketClient对象 | |

## 示例

```
系统事件 = {
 断开 = function(客户端)

 end,
}

```
