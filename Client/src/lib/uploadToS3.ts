import axios from "axios";

export async function uploadToS3(file: File, folder: string): Promise<string> {
  // Step 1: 获取后端预签名 URL
  const presignedRes = await axios.get("/api/s3/presigned-url", {
    params: {
      folder,
      fileName: file.name,
      contentType: file.type,
    },
  });

  const { uploadUrl, imageUrl } = presignedRes.data;

  // Step 2: 上传文件至 S3
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return imageUrl;
}
