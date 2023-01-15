import { ChangeEvent } from "react";
import axios from "axios";
import { getBase64StringFromDataURL } from "../utils/helpers";

const chunkSize = 5242880; // 5 MB

const FileUpload = () => {
  /**
   * Convert to base64 and then split chunks (Doesn't work for larger files above 400 MB)
   * @param file File
   * @param folder string
   * @returns Promise<string>
   */
  function sendFileChunks(file: File, folder: string | null): Promise<string> {
    return new Promise((resolve) => {
      const fileName = file.name;
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        let fileString = e.target?.result as string;
        fileString = getBase64StringFromDataURL(fileString);
        const fileLength = fileString.length;
        const chunkCount =
          fileLength > chunkSize ? Math.floor(fileLength / chunkSize) + 1 : 1;
        for (let chunkNo = 0; chunkNo < chunkCount; chunkNo++) {
          let fileSlice = fileString.slice(
            chunkNo * chunkSize,
            (chunkNo + 1) * chunkSize
          );
          const { data } = await axios.post("/upload-chunk", {
            chunk: fileSlice,
            file_name: fileName,
            folder,
          });
          folder = data.folder;
        }
        await axios.post("/upload-complete", { file_name: fileName, folder });
        resolve(folder as string);
      };
      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Sends a part/chunk of the file on backend and save it
   * @param file Blob
   * @param folder string | null
   * @param fileName string
   * @returns Promise<string>
   */
  function sendFileWithoutChunking(
    file: Blob,
    folder: string | null,
    fileName: string
  ): Promise<string> {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        let fileString = e.target?.result as string;
        fileString = getBase64StringFromDataURL(fileString);
        const { data } = await axios.post("/upload-chunk-octet-stream", {
          chunk: fileString,
          file_name: fileName,
          folder,
        });
        folder = data.folder;
        resolve(folder as string);
      };
      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Splits file blob into smaller blob chunks,
   * then convert smaller blob chunk to base64 and sending the same to the backend
   * @param file File
   * @param folder string | null
   * @returns Promise<string>
   */
  function sendFileChunksBlobSplit(
    file: File,
    folder: string | null
  ): Promise<string> {
    return new Promise((resolve) => {
      const fileName = file.name;
      const fileSize = file.size;
      const chunkCount =
        fileSize > chunkSize ? Math.floor(fileSize / chunkSize) + 1 : 1;
      (async () => {
        for (let chunkNo = 0; chunkNo < chunkCount; chunkNo++) {
          let fileSlice = file.slice(
            chunkNo * chunkSize,
            (chunkNo + 1) * chunkSize
          );
          console.log("Chunk", `${chunkNo + 1}/${chunkCount}`);
          folder = await sendFileWithoutChunking(fileSlice, folder, fileName);
        }
      })().then(() => resolve(folder as string));
    });
  }

  /**
   * Upload on selecting the file
   * @param e Event
   * @returns void
   */
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    let { files } = e.target;
    if (!files) return;
    console.time("Upload-Time");
    let folder: string | null = null;
    for (const file of files) {
      folder = await sendFileChunksBlobSplit(file, folder);
      // folder = await sendFileChunks(file, folder);
    }
    console.timeEnd("Upload-Time");
  }

  return (
    <>
      <div>FileUpload</div>
      <input type={"file"} onChange={handleFileChange} multiple />
    </>
  );
};

export default FileUpload;
