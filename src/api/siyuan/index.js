import request from "../fetch";

// 1. 判断有没有笔记本，没有则创建 （后续支持自定义笔记本和文件）
// 2. 判断文件是否存在，不存在则创建
// 3. 文件存在则写入数据
const DEFAULT_BOOK = "Tmouse";
const DEFAULT_DOC = "browser_data";

const getAllNoteBook = (params) => {
  return request("http://127.0.0.1:6806/api/notebook/lsNotebooks", params);
};

const createNoteBook = (params) => {
  return request("http://127.0.0.1:6806/api/notebook/createNotebook", params);
};

export const createDoc = (params) => {
  return request("http://127.0.0.1:6806/api/filetree/createDocWithMd", params);
};

const queryBookIdByPath = async (params) => {
  const allNotes = await getAllNoteBook();
  let noteBookId = allNotes?.data?.notebooks.find(
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
  const res = await request(
    "http://127.0.0.1:6806/api/filetree/listDocsByPath",
    {
      notebook: params.notebookId,
      path: "/",
    }
  );

  const fileId = res?.data.files.find((item) =>
    item.name.includes(DEFAULT_DOC)
  )?.id;
  return fileId;
};
export const insertBlock = async (params) => {
  const notebookId = await queryBookIdByPath();
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

  return request("http://127.0.0.1:6806/api/block/insertBlock", {
    dataType: params?.dataType || 'markdown',
    data: params?.message,
    nextID: "",
    previousID: "",
    parentID: fileId,
  });
};
