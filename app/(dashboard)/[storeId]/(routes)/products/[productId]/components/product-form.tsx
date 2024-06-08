"use client";

import Image from "next/image";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/extension/file-uploader";
import { FileSvgDraw } from "@/components/file_svg";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { DropzoneOptions } from "react-dropzone";
import SupabaseUploader from "@/lib/uploader";


type Product = Database['public']['Tables']['products']['Row'];
type ProductImage = Database['public']['Tables']['products_images']['Row'];

interface ProductFormProps {
    inialData: Product & { products_images: ProductImage[] } | null;
    categories: Database['public']['Tables']['categories']['Row'][];
    colors: Database['public']['Tables']['colors']['Row'][];
    sizes: Database['public']['Tables']['sizes']['Row'][];
}

const formSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().min(1),
    category_id: z.string().min(1),
    color_id: z.string().min(1),
    size_id: z.string().min(1),
    is_featured: z.boolean().default(false).optional(),
    is_archived: z.boolean().default(false).optional(),
    products_images: z.object({ url: z.string() }).array(),
});

type BillboardFormValues = z.infer<typeof formSchema>;


export const ProductForm: React.FC<ProductFormProps> = ({ inialData, categories, colors, sizes }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = inialData ? "Edit Product" : "Create Product";
    const description = inialData ? "Update the product details." : "Add a new product to the store.";
    const toastMessage = inialData ? "Product updated successfully." : "Product created successfully.";
    const action = inialData ? "Update" : "Create";


    const [files, setFiles] = useState<File[] | null>([]);

    const dropZoneConfig = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: true,
        maxFiles: 4,
        maxSize: 1 * 1024 * 1024,
    } satisfies DropzoneOptions;

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: inialData || {
            name: '',
            price: 0,
            products_images: [],
            category_id: '',
            color_id: '',
            size_id: '',
            is_featured: false,
            is_archived: false,
        },
    });

    useEffect(() => {
        if (inialData) {
            setLoading(true);
            inialData.products_images.forEach((image) => {
                fetch(image.url)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "Billboard Background", { type: blob.type });
                        setFiles((prev) => [...(prev || []), file]);
                    });
            });
            setLoading(false);
        }
    }, []);

    const onValueChange = async (value: File[] | null) => {
        if (value && value.length > 0 && value.length > (files?.length || 0)) {
            try {
                setLoading(true);
                const formData = new FormData();
                value.forEach((file) => {
                    formData.append("file", file);
                });

                const { data } = await SupabaseUploader({ formData: formData, bucket: 'products_images', folderName: `${params.storeId}` });

                if (data) {
                    form.setValue("products_images",
                        data.map((url: string) => {
                            return { url };
                        })
                    );
                    setFiles(value);
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            form.setValue("products_images", []);
            setFiles(value);
        }
    };

    const onSubmit = async (values: BillboardFormValues) => {
        try {
            setLoading(true);
            if (inialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/products`, values);
            }
            toast.success(toastMessage);
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
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
                        name="products_images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <div>
                                        <FileUploader
                                            value={files}
                                            onValueChange={onValueChange}
                                            dropzoneOptions={dropZoneConfig}
                                            reSelect={true}
                                            className="bg-background rounded-lg p-2 w-full"
                                        >
                                            <FileUploaderContent
                                                className="flex-row flex-row-2 md:flex-row-3 gap-4"
                                            >
                                                {files &&
                                                    files.length > 0 &&
                                                    files.map((file, i) => (
                                                        <FileUploaderItem
                                                            key={i}
                                                            index={i}
                                                            className="h-36 w-36"
                                                        >
                                                            <Image
                                                                src={URL.createObjectURL(file)}
                                                                alt="Product Image"
                                                                layout='fill'
                                                                objectFit='cover'
                                                            />
                                                        </FileUploaderItem>
                                                    ))}
                                            </FileUploaderContent>

                                            <FileInput className="outline-dashed outline-1 outline-white">
                                                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                                    <FileSvgDraw />
                                                </div>
                                            </FileInput>

                                        </FileUploader>
                                        {loading &&
                                            (
                                                <div className="absolute inset-0 bg-neutral-900 opacity-50 z-10">
                                                    <div
                                                        className="flex items-center justify-center h-full w-full bg-neutral-900 opacity-50 z-10"
                                                    >
                                                        <Loader2 className="animate-spin mx-auto h-8 w-8" />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Product name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder="9.99"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="size_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.id}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="color_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem key={color.id} value={color.id}>
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Featured</FormLabel>
                                        <FormDescription>
                                            Display this product on the featured section.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_archived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription>
                                            Hide this product from the store.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                        {loading && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
                    </Button>
                </form>
            </Form>
        </>
    );
}