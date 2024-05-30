"use client";

import * as z from "zod";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@/components/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const { isOpen, onClose } = useStoreModal();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const { data: store } = await axios.post("/api/stores", values);
            console.log(store);

            window.location.assign(`/${store.id}`);
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while creating the store.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Create Store"
            description="Add a new store to your account."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="E-commerce Store"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    disabled={loading}
                                    variant='outline'
                                    type="button"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    disabled={loading}
                                    type="submit"
                                >
                                    Continue
                                </Button>
                            </div>

                        </form>
                    </Form>
                </div>

            </div>
        </Modal>
    );
};