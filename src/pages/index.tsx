import styles from "./index.less";
import { Button, Form, Input, Select, Space, message } from "antd";
import axios from "axios";
import { YApi2Ts } from "@/pages/YApi2Ts";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const index = () => {
  const [params, setParams] = useState<string>();
  const [result, setResult] = useState<string>();

  const onFinish = async (values: { token: string; interfaceId: string }) => {
    const { token, interfaceId } = values;

    if (token && interfaceId) {
      const res = await axios(
        `/api/interface/get?token=${token}&id=${interfaceId}`
      );
      if (res?.data?.data) {
        const { queryParams, bodyParams, resultData } = YApi2Ts(res.data.data);
        setParams(queryParams || bodyParams);
        setResult(resultData);
      }
      // 获取请求form-body类型的请求参数
    }
  };
  return (
    <div className={styles.Container}>
      <h1 className={styles.contentTitle}>YApi2TS</h1>
      <div className={styles.contentFilter}>
        <Form layout="inline" onFinish={onFinish}>
          <Form.Item label="选择项目组" name="token" required>
            <Select
              style={{ width: 120 }}
              options={[
                {
                  value:
                    "59101d71c85ee7f6d2bda25e888c1ef174d1be97994de106ae4b83f3aff3d5b8",
                  label: "CP",
                },
                {
                  value:
                    "64ed45edbf9f23b0a740abfd9100880ff3cf8ddcb1ff3cdaf88d8bec88bb9b8e",
                  label: "海外",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="接口id" name="interfaceId" required>
            <Input placeholder="请输入接口id" allowClear />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={styles.codeContent}>
        <Space>
          {params && (
            <CopyToClipboard
              text={params ?? ""}
              onCopy={() => {
                message.success("复制成功");
              }}
            >
              <Button>复制请求参数</Button>
            </CopyToClipboard>
          )}
          {result && (
            <CopyToClipboard
              text={result ?? ""}
              onCopy={() => {
                message.success("复制成功");
              }}
            >
              <Button>复制响应参数</Button>
            </CopyToClipboard>
          )}
        </Space>
      </div>
    </div>
  );
};

export default index;
