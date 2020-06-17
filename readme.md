# BDS Manager V0.1

## 使用教程

### 编辑配置文件

```json
{
  "serverName": "AA", //服务器名字,未实装
  "serverPath": "C:/mc-server/bedrock-server-1.14.21.0/", //服务器主目录 
  "serverStartTime": "2019-06-12",//开服时间(月份，日期是个位数前面要添加0) 
  "serverPlatform": "Windows",//服务器平台，未实装 
  "dbFileName": "./data.db",//数据库文件(随便填个文件名) 

  "autoBackup": true, //是否启用自动备份(未实装)
  "backupCycle": 3, //备份周期(单位天)

  "enableWeb": true, //是否启用网页端数据查询以及管理(管理部分未实装)
  "webRunCommand": false, //是否允许在网页端向服务器发送命令
  "webShowStartTime": true, //未实装
  "webPermission": "all", //管理权限
  "webPassword": 0, //管理后台的密码(未实装)
  "port": 80 //网页端的端口(默认80)
}
```

### 启动服务器

#### 安装相关依赖

```powershell
npm install
```
#### 启动服务器

```powershell
node main.js
```






