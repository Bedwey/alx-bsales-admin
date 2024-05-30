'use server';

import { createClient } from "@/utils/supabase/server";

interface SupabaseFileRouter {
    formData: FormData,
    bucket: string;
    folderName?: string;

}

export default async function SupabaseUploader({ formData, bucket, folderName }: SupabaseFileRouter) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { data: null, error: 'User not authenticated' };
    }

    const paths: string[] = [];
    const files: File[] = formData.getAll('file') as File[];

    for (const file of files) {
        // file.type
        const name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + `.${file.name.split('.').pop()}`;
        const filePath = folderName ? `${session?.user.id}/${folderName}/${name}` : `${session?.user.id}/${name}`;

        const { data, error } = await supabase.storage.from(bucket).upload(filePath, file);
        if (error) {
            return { data: null, error: error.message };
        } else {
            paths.push(`${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data.path}`);
        }
    }
    return { data: paths, error: null };
}