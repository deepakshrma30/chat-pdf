"use client";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/db/s3";
import { createChat } from "@/services/mutation";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileUpload() {
  const router=useRouter()
  const { toast } = useToast();
  const [uploading,setUploading]=useState<boolean>(false)
  const mutate=useMutation({
    mutationFn:createChat
  })
  const { getInputProps, getRootProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (file) => {
      console.log(file, "file");
      const acceptedFile = file[0];
      if (acceptedFile.size > 10 * 1024 * 1024) {
        toast({
          description: "Please upload pdf less than 10 MB",
          variant: "destructive",
        });
        return;
      }
      try {
        setUploading(true)
        const data = await uploadFile(acceptedFile);

        mutate.mutate(data!,{
          onSuccess:(data)=>{
            setUploading(false);
            toast({
              description:data?.messages
            })
            router.push(`chat/${data?.chatId}`)
          },
          onError:(error)=>{
            console.log(error)
            toast({
              description:"Something went wrong",
              variant:"destructive"
            })
            setUploading(false)
          }
        })
      } catch (error) {
        console.log(error);
      }finally{
        // setUploading(false)
      }
    },
  });
  return (
    <div
      className="w-full p-8 border-2 border-dashed border-gray-600 rounded-lg text-center bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      {...getRootProps()}
    >
      {
        uploading ? <>
        <Loader2 className="h-10 w-10 text-white mx-auto animate-spin"/>
        </> :
        <>
        
      <Upload className="w-12 h-12 mx-auto text-gray-400" />
      <p className="mt-2 text-sm text-gray-300">
        Drag and drop your PDF here, or click to select a file
      </p>
        </>
      }
      <input {...getInputProps()} />
      
    </div>
  );
}
