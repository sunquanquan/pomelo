
## **战斗模式进入关卡**
- 请求地址 area.levelHandler.enterLevel;
- 接口参数：params数据采用3DES,base64,urlencode加密
- 请求参数：

| 参数名        |  类型    | 是否可选  | 意义  |
| :--------    | --------:|---------:| :--: |
| isRetry      | int32    | 必选     | 是否重连  |
| checkID      | string   | 必选     | 校验id  |
| uid       | string   | 必选     | 用户id   |
| token       | string   | 必选     | token   |
| clean      | int32    | 可选     | 是否是扫荡  |
| level      | int32    | 可选     | 关卡  |
| difficulty      | int32    | 可选     | 模式  |

- 返回值：

| 参数名        |  类型    | 是否可选  | 意义  |
| :--------    | --------:|---------:| :--: |
| code       | int32    | 必选     | 200|