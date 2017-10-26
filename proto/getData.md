## **获取用户数据**
- 请求地址 area.levelHandler.getData;
- 接口参数：params数据采用3DES,base64,urlencode加密
- 请求参数：

| 参数名        |  类型    | 是否可选  | 意义  |
| :--------    | --------:|---------:| :--: |
| isRetry      | int32    | 必选     | 是否重连  |
| checkID      | string   | 必选     | 校验id  |
| uid       | string   | 必选     | 用户id   |
| token       | string   | 必选     | token   |
| user      | int32    | 可选     | 用户数据  |
| roles      | int32    | 可选     | 玩家拥有的角色  |
| level      | int32    | 可选     | 玩家的关卡的信息  |

- 返回值：

| 参数名        |  类型    | 是否可选  | 意义  |
| :--------    | --------:|---------:| :--: |
| code       | int32    | 必选     | 200|
| userData       | obj    | 可选     | 用户数据|
| roles       | obj    | 可选     | 玩家拥有的角色|
| level       | obj    | 可选     | 玩家的关卡的信息|