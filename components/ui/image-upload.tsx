"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { Trash } from "lucide-react";
import Image from "next/image";
import { FileUpload, SupabaseFilesBuckets } from "../file-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
}) => {
    const router = useRouter();
    const accept = { 'image/jpeg': ['.jpg'] };
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const onUpload = (result: any) => {
        onChange(result);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2h">
                            <Button type="button" onClick={() => onRemove(url)} variant='destructive' size='icon'>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <FileUpload
                name="image"
                accept={accept}
                onCompleted={(url) => {
                    onUpload({ image_url: url[0] });
                }}
                onError={(message) => {
                    toast.error(message);
                    router.refresh();
                }}
                bucket={SupabaseFilesBuckets.Billboards}
            />
            <div className='text-sm text-muted-foreground mt-4'>
                Best image size: 1920x1080
            </div>
        </div>
    );
}

export default ImageUpload;