import { copyText } from "vue3-clipboard";
export const copyLink = (link: string) => {
  return new Promise((resolve, reject) => {
    copyText(link, undefined, (err: any, event: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};
