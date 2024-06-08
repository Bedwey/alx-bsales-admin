"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/utils/supabase/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Image from "next/image";

import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/extension/file-uploader";
import { DropzoneOptions } from "react-dropzone";
import SupabaseUploader from "@/lib/uploader";
import { FileSvgDraw } from "@/components/file_svg";

type Billboard = Database['public']['Tables']['billboards']['Row'];

interface BillboardFormProps {
    inialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(1),
    image_url: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({ inialData }) => {
    const params = useParams();
    const router = useRouter();

    const [files, setFiles] = useState<File[] | null>([]);

    const dropZoneConfig = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: false,
        maxFiles: 1,
        maxSize: 1 * 1024 * 1024,
    } satisfies DropzoneOptions;


    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = inialData ? "Edit Billboard" : "New Billboard";
    const description = inialData ? "Edit your billboard here." : "Create a new billboard here.";
    const toastMessage = inialData ? "Billboard updated successfully." : "Billboard created successfully.";
    const action = inialData ? "Update Billboard" : "Create Billboard";


    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: inialData || { label: '', image_url: '' },
    });

    useEffect(() => {
        if (inialData) {
            setLoading(true);
            fetch(inialData.image_url)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "Billboard Background", { type: blob.type });
                    setFiles([file]);
                });
            setLoading(false);
        }
    }, [inialData]);


    const onValueChange = async (value: File[] | null) => {
        if (value !== null && value.length > 0) {
            try {
                setLoading(true);
                const file = value[0];
                const formData = new FormData();
                formData.append('file', file);
                const { data, error } = await SupabaseUploader({ formData: formData, bucket: 'billboards', folderName: `${params.storeId}` });
                if (data) {
                    form.setValue("image_url", data[0]);
                    setFiles(value);
                }

                if (error) {
                    toast.error(error);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            console.log("Value changed to null");
            form.setValue("image_url", "");
            setFiles(value);
        }
    };

    const onSubmit = async (values: BillboardFormValues) => {
        try {
            setLoading(true);
            if (inialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, values);
            }
            toast.success(toastMessage);
            router.push(`/${params.storeId}/billboards`);
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />

                {
                    inialData && (
                        <Button variant='destructive' size='sm' onClick={() => setOpen(true)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    )
                }
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <FileUploader
                                            value={files}
                                            onValueChange={onValueChange}
                                            dropzoneOptions={dropZoneConfig}
                                            reSelect={true}
                                            className="relative bg-background rounded-lg p-2 w-full"
                                        >
                                            <FileInput className="outline-dashed outline-1 outline-white">
                                                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                                    <FileSvgDraw />
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {files &&
                                                    files.length > 0 &&
                                                    files.map((file, i) => (
                                                        <FileUploaderItem
                                                            key={i}
                                                            index={i}
                                                            className="h-12 w-full bg-background rounded-lg p-2 flex items-center justify-center gap-x-2"
                                                        >
                                                            <Image src={URL.createObjectURL(file)} width={30} height={30} alt={""} />
                                                            <span>{file.name}</span>
                                                        </FileUploaderItem>
                                                    ))}
                                            </FileUploaderContent>
                                        </FileUploader>
                                        {loading && <div className="absolute inset-0 bg-neutral-900 opacity-50 z-10"></div>}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={loading}
                                        placeholder="Billboard name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading || files?.length == 0} className="ml-auto" type="submit">
                        {action}
                        {loading && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
                    </Button>
                </form>
            </Form>
        </>
    );
}