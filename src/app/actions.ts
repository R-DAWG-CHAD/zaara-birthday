"use server";

import { put, list } from '@vercel/blob';

export async function uploadPhoto(base64Data: string) {
  try {
    const base64 = base64Data.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const filename = `zaara-17th-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    return blob.url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Failed to upload photo");
  }
}

export async function getGalleryPhotos() {
  try {
    const { blobs } = await list();
    // Sort newest first
    const sorted = blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    return sorted.map(b => b.url);
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return [];
  }
}
