import { useToast } from "@/components/ui/use-toast"
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachments {
    file: File,
    mediaId?: string,
    isUploading: boolean   
}

export default function useMediaUploads() {
    const { toast } = useToast();

    const [attachments, setAttachments] = useState<Attachments[]>([])

    const [uploadProgress, setUploadProgress] = useState<number>();
    const { startUpload, isUploading } = useUploadThing("attachment", {
        onBeforeUploadBegin(files) {
            const renamedFiles = files.map((file) => {
                const extension  = file.name.split(".").pop();
                return new File(
                    [file],
                    `attachments_${crypto.randomUUID()}.${extension}`,
                    {
                        type: file.type
                    }
                )
            })
            setAttachments(prev => [
                ...prev,
                ...renamedFiles.map(file => ({ file, isUploading: true}))
            ])

            return renamedFiles
        },
        onUploadProgress: setUploadProgress,
        onClientUploadComplete(res) {
            setAttachments((prev) =>
              prev.map((a) => {
                const uploadResult = res.find((r) => r.name === a.file.name);
      
                if (!uploadResult) return a;
      
                return {
                  ...a,
                  mediaId: uploadResult.serverData.mediaId,
                  isUploading: false,
                };
              }),
            );
          },
          onUploadError(e) {
            setAttachments((prev) => prev.filter((a) => !a.isUploading));
            toast({
              variant: "destructive",
              description: e.message,
            });
          }
    })

    function handleUpload(files: File[]) {
        if(isUploading) {
            toast({
                variant: "destructive",
                description: "Please wait for the current upload to complete"
            })

            return;
        }

        if(attachments.length + files.length > 5) {
            toast({
                variant: "destructive",
                description: "You can only upload a maximum of 5 files"
            })

            return;
        }
        startUpload(files)
    }

    function removeAttachments(fileName: string) {
        setAttachments((prev) => prev.filter((a) => a.file.name !== fileName))
    }

    function reset(){
        setAttachments([])
        setUploadProgress(undefined) 
    }

    return {
        startUpload: handleUpload,
        attachments,
        isUploading,
        uploadProgress,
        removeAttachments,
        reset,  
    }
}