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
