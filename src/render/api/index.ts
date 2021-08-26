import request from "../../utils/request";
export function getFileList(args: any) {
  return request.get("/api/file/list", {
    params: args,
  });
}

export function addDirectory(args: any): any {
  return request.post("/api/directory/add", args);
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
