import { supabase } from "../lib/supabase";

export const generateSignedURL = async (receiptPath: string) => {
    const {data, error} = await supabase.storage.from("Receipts").createSignedUrl(receiptPath, 60);

    if(error) throw new Error(`Generate signed URL failed ${error.message}`)

    return data.signedUrl;
} 