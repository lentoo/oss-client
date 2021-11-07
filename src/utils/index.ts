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

import IconImage from "../render/resources/images/icon-image.png";
import IconMp3 from "../render/resources/images/icon-mp3.png";
import IconVideo from "../render/resources/images/icon-video.png";
import IconPdf from "../render/resources/images/icon-pdf.svg";
import IconUnKnow from "../render/resources/images/icon-unknow.png";
import IconJS from "../render/resources/images/icon-js.svg";
import IconXlsx from "../render/resources/images/icon-xlsx.svg";
import IconWord from "../render/resources/images/icon-word.svg";
import IconPPT from "../render/resources/images/icon-ppt.svg";
const mimetypeMap: {
  [key: string]: string;
} = {
  "image/gif": IconImage,
  "image/png": IconImage,
  "image/jpg": IconImage,
  "image/jpeg": IconImage,
  "image/bmp": IconImage,
  "image/webp": IconImage,
  "audio/mpeg": IconMp3,
  "audio/aac": IconMp3,
  "audio/weba": IconMp3,
  "video/mpeg": IconVideo,
  "video/webm": IconVideo,
  "video/mp4": IconVideo,
  "video/x-msvideo": IconVideo,
  "application/pdf": IconPdf,
  "text/javascript": IconJS,
  "text/csv": IconXlsx,
  "application/msword": IconWord,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    IconWord,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
    IconWord,
  "application/vnd.ms-word.document.macroEnabled.12": IconWord,
  "application/vnd.ms-word.template.macroEnabled.12": IconWord,

  "application/vnd.ms-excel": IconXlsx,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": IconXlsx,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
    IconXlsx,
  "application/vnd.ms-excel.sheet.macroEnabled.12": IconXlsx,
  "application/vnd.ms-excel.template.macroEnabled.12": IconXlsx,
  "application/vnd.ms-excel.addin.macroEnabled.12": IconXlsx,
  "application/vnd.ms-excel.sheet.binary.macroEnabled.12": IconXlsx,

  "application/vnd.ms-powerpoint": IconPPT,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    IconPPT,
  "application/vnd.openxmlformats-officedocument.presentationml.template":
    IconPPT,
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
    IconPPT,
  "application/vnd.ms-powerpoint.addin.macroEnabled.12": IconPPT,
  "application/vnd.ms-powerpoint.presentation.macroEnabled.12": IconPPT,
  "application/vnd.ms-powerpoint.template.macroEnabled.12": IconPPT,
  "application/vnd.ms-powerpoint.slideshow.macroEnabled.12": IconPPT,
  // "text/javascript": IconJS,
  // "text/javascript": IconJS,
};
export function mimetypeToImage(mimetype: string): string {
  return mimetypeMap[mimetype] || IconUnKnow;
}
export function mimetypeIsImage(mimetype: string): boolean {
  return mimetypeMap[mimetype] === IconImage;
}

export function mimetypeIsVideo(mimetype: string): boolean {
  return mimetypeMap[mimetype] === IconVideo;
}

export function mimetypeIsAudio(mimetype: string): boolean {
  return mimetypeMap[mimetype] === IconMp3;
}
