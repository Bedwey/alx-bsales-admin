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
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type Color = Database['public']['Tables']['colors']['Row'];

interface ColorFormProps {
    inialData: Color | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#[0-9A-F]{6}$/i, { message: 'Invalid color value.' }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ inialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = inialData ? "Update Color" : "Create Color";
    const description = inialData ? "Update the color details." : "Create a new color.";
    const toastMessage = inialData ? "Color updated successfully." : "Color created successfully.";
    const action = inialData ? "Update Color" : "Create Color";

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: inialData || { name: '', value: '' },
    });

    const onSubmit = async (values: ColorFormValues) => {
        try {
            setLoading(true);
            if (inialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
            } else {
                await axios.post(`/api/${params.storeId}/colors`, values);
            }

            toast.success(toastMessage);
            router.push(`/${params.storeId}/colors`);
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`);
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
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder="Color name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">

                                            <Input
                                                disabled={loading}
                                                placeholder="Color value"
                                                {...field}
                                            />
                                            <div
                                                className="border pr-4 rounded-full w-8 h-8"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
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
        </>
    );
}