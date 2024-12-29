import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";
export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "ap-south-1",
        credentials: {
            accessKeyId:process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
            secretAccessKey:process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
        },
      });
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.getObject(params);
      const tempDir = os.tmpdir(); // Get system's temporary directory
      const file_name = path.join(tempDir, `chat${Date.now().toString()}.pdf`);

      // Ensure the temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      if (obj.Body instanceof require("stream").Readable) {
        // Open writable stream and write file
        const file = fs.createWriteStream(file_name);
        file.on("open", function () {
          // Pipe the S3 object to the file
          //@ts-ignore
          obj?.Body?.pipe(file).on("finish", () => {
            resolve(file_name);
          });
        });
      } else {
        reject(new Error("The S3 object body is not a readable stream."));
      }
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}