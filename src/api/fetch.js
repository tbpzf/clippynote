import { message } from "antd";

const request = async (url, data) => {
  const originHeaders = {
    "Content-Type": "application/json",
  };
  const { showToast = true, headers, ...restData } = data || {};

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      headers: {
        ...originHeaders,
        ...headers
      },
      body: JSON.stringify(restData),
    })
      .then(async (response) => {
        let errorText = "";
        if (response.status === 401) {
          errorText = "请设置token";
        } else if (response.status === 404) {
          errorText = "接口不存在";
        } else if (!response.ok) {
          errorText = `服务不可用 ${response.status}`;
        }

        if (errorText) {
          showToast && message.error(errorText);
          throw new Error(errorText);
        }
        const result = await response.json();
        resolve({
          data: result.data,
          error: null,
        });
      })
      .catch((error) => {
        if (["NetworkError", "TypeError"].includes(error.name)) {
          showToast && message.error("请打开思源笔记");
        }
        resolve({
          data: null,
          error,
        });
      });
  });
};

export default request;
