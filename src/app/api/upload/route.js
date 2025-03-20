import { getBlobSasUrl } from "@/lib/azure"; // 👈 New function to generate SAS token
import { uploadBlob } from "@/lib/azure";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("image");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const fileBuffer = await file.arrayBuffer();
  
  // Upload the image to Azure Blob Storage
  const uploadSuccess = await uploadBlob(fileName, fileBuffer);
  if (!uploadSuccess) {
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
  }

  // Generate SAS URL for the uploaded image
  const imageUrl = await getBlobSasUrl(fileName);

  return new Response(JSON.stringify({ imageUrl }), { status: 200 });
}




