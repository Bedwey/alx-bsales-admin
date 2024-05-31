"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/utils/supabase/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Image from "next/image";

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


    const [editing, setEditing] = useState(false);
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

    const onSubmit = async (values: BillboardFormValues) => {
        try {
            setLoading(true);
            if (inialData) {
                await axios.patch(`/api/stores/${params.storeId}/billboards/${params.billboardId}`, values);
            } else {
                await axios.post(`/api/stores/${params.storeId}/billboards`, values);
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push("/");
        } catch (error) {
            toast.error("Make sure to delete all products and orders before deleting the store.");
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
                                <FormLabel className="flex items-center gap-x-4">
                                    Background Image
                                    {field.value && (
                                        <Button
                                            variant='outline'
                                            size='icon'
                                            type="button"
                                            onClick={() => setEditing(!editing)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    )}
                                </FormLabel>
                                <FormControl>
                                    <div className="h-[250px]">
                                        {field.value && editing ? (
                                            <Image
                                                className="object-cover rounded-md overflow-hidden"
                                                alt="Image"
                                                src={field.value}
                                                width={400}
                                                height={200}
                                                objectFit="cover"
                                            />


                                        ) : (
                                            <ImageUpload
                                                value={field.value ? [field.value] : []}
                                                onChange={(value) => form.setValue('image_url', value)}
                                                onRemove={() => form.setValue('image_url', '')}
                                            />
                                        )}

                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-3 gap-8">
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
                    </div>
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>

            <Separator />

        </>
    );
}