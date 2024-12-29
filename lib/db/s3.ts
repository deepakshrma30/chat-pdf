import "dotenv/config";
import AWS from "aws-sdk";
import {
  DeleteObjectCommand,
  PutObjectCommandOutput,
  S3,
} from "@aws-sdk/client-s3";

// export async function uploadFileS3(file:File){
//     try {
//         AWS.config.update({
//             accessKeyId:process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
//             secretAccessKey:process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
//         })

//         const s3= new AWS.S3({
//             params:{
//                 Bucket:process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,

//             },
//             region:"ap-south-1"
//         })
//         const file_Key="rgb"+Date.now().toString()

//         const params={
//             Bucket:process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
//             Key:file_Key,
//             Body:file
//         }
//         const upload=s3.putObject(params).on("httpUploadProgress",event=>{
//             console.log("uploading", parseInt(((event.loaded * 100) / event.total).toString()));
//         }).promise()
//         await upload.then(()=>{
//             console.log("success")
//         })

//         return Promise.resolve({
//             file_Key,
//             fileName:file.name
//         })
//     } catch (error) {

//     }
// }

export async function uploadFile(
  file: File
): Promise<{ file_key: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "ap-south-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
        },
      });

      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            fileName: file.name,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  console.log(file_key, "urllllll");
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}

export async function deleteFromS3(file_key: string) {
  try {
    const s3 = new S3({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: file_key,
    };
    const data = await s3.send(new DeleteObjectCommand(params));
    console.log(data, "s3 delete");

    return data;
  } catch (error) {}
}
