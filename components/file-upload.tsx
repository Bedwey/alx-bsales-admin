'use client';

import SupabaseUploader from '@/lib/uploader';
import { Loader2Icon, UploadIcon } from "lucide-react";
import { useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Button } from './ui/button';
import { Input } from "./ui/input";

export enum SupabaseFilesBuckets {
    CourseImages = 'course_images',
    CourseAttachments = 'courses_attachments',
}

interface FileUploadProps {
    name: string;
    accept?: Accept;
    bucket: SupabaseFilesBuckets;
    folderName?: string;
    onCompleted: (paths: string[], fileNames: string[]) => void;
    onError: (message: string) => void;
    multiple?: boolean;
    maxFiles?: number;
}

export const FileUpload = ({ bucket, folderName, accept, onCompleted, onError, maxFiles, multiple }: FileUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        maxFiles: maxFiles || 1,
        multiple: multiple || false,
        accept,
        noKeyboard: true,
        maxSize: (bucket === SupabaseFilesBuckets.CourseImages) ? 4 * 1024 * 1024 : 15 * 1024 * 1024,
        disabled: isUploading,
    });

    return (
        <form action={async (e) => {
            const formData = new FormData();
            acceptedFiles.forEach(file => formData.append('file', file));
            const { data, error } = await SupabaseUploader({ formData: formData, bucket, folderName });

            if (error) {
                onError(error);
            } else {
                onCompleted(data!, acceptedFiles.map(file => file.name));
            }
        }}>
            <div {...getRootProps({ className: 'flex flex-col items-center aspect-video justify-center border-2 border-dashed hover:border-primary gap-y-2 transition-all' })}>
                <Input {...getInputProps({ name: 'file' })} />
                <UploadIcon className="h-8 w-8 text-primary" />
                <p className="text-primary">
                    {isDragActive ? 'سيبها هنا' : 'قم بالسحب والافلات هنا'}
                </p>
                {acceptedFiles.length > 0 &&
                    <p className="text-primary">
                        <Button
                            onClick={(e) => { e.stopPropagation(); setIsUploading(true); }}
                            className='w-28 font-bold'
                            type='submit'
                        >
                            {isUploading ?
                                <>
                                    <Loader2Icon className="animate-spin h-8 w-8" />
                                </> :
                                <>
                                    رفع {acceptedFiles.length}
                                </>
                            }
                        </Button>
                    </p>
                }
            </div>
        </form >
    );
}