import { BlobServiceClient, generateBlobSASQueryParameters, StorageSharedKeyCredential } from "@azure/storage-blob";

const AZURE_STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_STORAGE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME; // Change this to your actual container name

// Function to upload an image to Azure Blob Storage
export async function uploadBlob(blobName, fileBuffer) {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(fileBuffer);
    console.log(`✅ Uploaded: ${blobName}`);
    return true;
  } catch (error) {
    console.error("❌ Error uploading blob:", error);
    return false;
  }
}

// Function to generate a SAS token for accessing the uploaded image
export async function getBlobSasUrl(blobName) {
  const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY);
  const blobServiceClient = new BlobServiceClient(`https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, sharedKeyCredential);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlobClient(blobName);

  // Generate SAS token (valid for 1 hour)
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName: blobName,
      expiresOn: expiry,
      permissions: "r",
    },
    sharedKeyCredential
  ).toString();

  return `${blobClient.url}?${sasToken}`;
}

export async function deleteBlob(blobName) {
  try {
    console.log(`🗑 Attempting to delete blob: ${blobName} from container: ${CONTAINER_NAME}`);

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blobClient = containerClient.getBlobClient(blobName);

    const deleteResponse = await blobClient.deleteIfExists();

    if (deleteResponse.succeeded) {
      console.log(`✅ Successfully deleted: ${blobName}`);
    } else {
      console.log(`⚠️ Warning: Blob ${blobName} was not found or could not be deleted.`);
    }

    return deleteResponse.succeeded;
  } catch (error) {
    console.error("❌ Error deleting blob:", error);
    return false;
  }
}

