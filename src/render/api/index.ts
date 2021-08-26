import request from "../../utils/request";
import { IFile } from "../../types";
import type { AxiosResponse } from "axios";
export function getFileList(args: any) {
  return request.get("/api/file/list", {
    params: args,
  });
}

export function addDirectory(args: any): any {
  return request.post("/api/directory/add", args);
}
export function addFile(args: IFile): Promise<any> {
  return request.post("/api/file/add", args);
}
export function deleteFile(args: any): any {
  return request.delete("/api/file", {
    params: args,
  });
}

export function renameFile(
  file_id: string,
  filename: string,
  parent_id: string
): any {
  return request.post("/api/file/rename", {
    _id: file_id,
    filename,
    parent_id,
  });
}

const APPID = import.meta.env.VITE_APPID;
const UPLOAD_API = `${import.meta.env.VITE_UPLOAD_BASEURL}${
  import.meta.env.VITE_UPLOAD_API
}`;

export async function handleUpload(file: File) {
  const data = {
    appId: APPID,
    clientIp: "127.0.0.1",
    requestId: "",
    clientId: "",
  };
  const token = await request.get(UPLOAD_API, {
    params: data,
    xsrfCookieName: "csrfToken",
    xsrfHeaderName: "x-csrf-token",
  });
  const { uploadUrl } = token.data.policyList[0];
  const { formFields } = token.data.policyList[0];
  let form = new FormData();
  if (formFields.length) {
    formFields.forEach((item: any) => {
      form.append(item.key, item.value);
    });
  }
  form.append("file", file);
  let config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const result = await request.post(uploadUrl, form, config);
  console.log(result);
  return result.data;
}
