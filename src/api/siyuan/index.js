import request from "../fetch";
import { SI_YUAN_API_URL, TEST_TOKEN } from "./config";
// 1. 判断有没有笔记本，没有则创建 （后续支持自定义笔记本和文件）
// 2. 判断文件是否存在，不存在则创建
// 3. 文件存在则写入数据
const DEFAULT_BOOK = "Tmouse";
const DEFAULT_DOC = "browser_data";

const requestSiYuan = (url, params) => {
  return request(`${SI_YUAN_API_URL}/${url}`, {
    ...params,
    headers: {
      Authorization: `token ${TEST_TOKEN}`,
    },
  });
};

const getAllNoteBook = (params) => {
  return requestSiYuan("notebook/lsNotebooks", params);
};

const createNoteBook = (params) => {
  return requestSiYuan("notebook/createNotebook", params);
};

export const createDoc = (params) => {
  return requestSiYuan("filetree/createDocWithMd", params);
};

const queryBookIdByPath = async (params) => {
  const allNotes = await getAllNoteBook();
  if (allNotes.error) {
    return;
  }

  let noteBookId = allNotes?.data.notebooks.find(
    (item) => item.name === DEFAULT_BOOK
  )?.id;
  if (!noteBookId) {
    const res = await createNoteBook({
      name: DEFAULT_BOOK,
    });
    noteBookId = res?.data?.notebook?.id;
  }
  return noteBookId;
};

const getFileID = async (params) => {
  const res = await requestSiYuan("filetree/listDocsByPath", {
    notebook: params.notebookId,
    path: "/",
  });

  const fileId = res?.data.files.find((item) =>
    item.name.includes(DEFAULT_DOC)
  )?.id;
  return fileId;
};
export const insertBlock = async (params) => {
  const notebookId = await queryBookIdByPath();
  if (!notebookId) {
    return;
  }
  let fileId = await getFileID({
    notebookId,
  });
  if (!fileId) {
    const res = await createDoc({
      notebook: notebookId,
      path: `/${DEFAULT_DOC}`,
      markdown: "",
    });
    fileId = res?.data;
  }

  return requestSiYuan("block/insertBlock", {
    dataType: params?.dataType || "markdown",
    data: params?.message,
    nextID: "",
    previousID: "",
    parentID: fileId,
  });
};
