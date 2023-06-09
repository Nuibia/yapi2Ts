interface IParams {
  /** 备注 */
  desc: string;
  /** 例子  */
  example: string;
  /** 字段名 */
  name: string;
  /** 是否必选 */
  required: string;
  /** 类型 */
  type: string;
  _id: string;
}
interface IResult {
  type: string;
  title: string;
  description: string;
}

/** 后端-前端类型映射 */
export const TypeObj: Record<string, string> = {
  text: "string",
  string: "string",
  long: "number",
  number: "number",
  boolean: "boolean",
};

export const YApi2Ts = (data: any) => {
  const {
    /** 接口名称 */
    title,
    /** 接口创建人 */
    username,
    /** 接口路径 */
    path,
    /** body请求参数 */
    req_body_form,
    /** 返回数据-响应报文 */
    res_body,
    /** query请求参数 */
    req_query,
  } = data;
  console.log(data);
  return {
    // 请求参数
    queryParams: ReturnParams(req_query, path),
    bodyParams: ReturnParams(req_body_form, path),
    // 详情参数
    resultData: ReturnResult(res_body, path),
  };

  //TODO: 请求主体
};

// 请求params
export const ReturnParams = (data: IParams[], path: string) => {
  if (data?.length) {
    let params = `export interface I${finallyCode(path)}Params {`;
    data.forEach((item) => {
      params += `/** ${item.desc} */`;
      params += `${item.name}`;
      params += `${item.required === "0" ? "?" : ""}:`;
      params += `${TypeObj?.[item.type] ?? "any"}`;
      params += `;`;
    });
    params += `}`;
    return replaceString(params);
  }
};
// 响应result
export const ReturnResult = (data: string, path: string) => {
  const JsonData: { [s: string]: IResult } =
    JSON.parse(data).properties.data.properties;
  if (JsonData) {
    let params = `export interface I${finallyCode(path)}Result {`;
    params += formatObject(JsonData);
    params += `}`;
    return replaceString(params);
  }
};

/** 获取路径的最后一个/后的值，并首字母大写 */
export const finallyCode = (path: string) => {
  const array = path.split("/");
  return (
    array?.[array.length - 1][0].toUpperCase() +
    array[array.length - 1].slice(1)
  );
};

export const formatObject = (data: { [s: string]: IResult }) => {   
  
  if(data) {
    let finallyCode = "";
    for (const [key, value] of Object.entries(data)) {
      if (value.type === "object") {
        finallyCode += `${key}:{`;
        finallyCode += formatObject((value as any)?.properties);
        finallyCode += `};`;
      } else if (value.type === "array") {
        if((value as any).items.type === "object"){
          finallyCode += `${key}:{`;
          finallyCode += `${formatObject((value as any)?.items?.properties)}`;
          finallyCode += `}[]`;
        }else {
          finallyCode += `${key}:${(value as any).items.type}[]`
        }
      } else {
        finallyCode += `/** ${value?.description} */ `;
        finallyCode += `${key}:`;
        finallyCode += `${TypeObj?.[value?.type]};`;
      }
    }
    return finallyCode;
  }  
};

/** 换行规则：
 *  {
 *  }
 *  ;
 *  \*\/
 */
const replaceString = (data: string) => {
  return data.replace(/([{|;|\]]|\*\/)/g, "$&\n");
};
