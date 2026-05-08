// ============================================
// TOOLVAULT PRO — CLOUDINARY CLIENT
// ============================================
import { v2 as cloudinary } from 'cloudinary'
import { serverEnv, publicEnv } from './env'

// ============================================
// CONFIGURE CLOUDINARY
// ============================================
cloudinary.config({
  cloud_name: publicEnv.cloudinaryCloudName,
  api_key:    serverEnv.cloudinaryApiKey,
  api_secret: serverEnv.cloudinaryApiSecret,
  secure:     true,
})

// ============================================
// UPLOAD IMAGE
// ============================================
export async function uploadImage(
  file: string,
  folder: string = 'toolvault',
  userId?: string
): Promise<{
  success: boolean
  url?: string
  publicId?: string
  error?: string
}> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `${folder}/${userId ?? 'anonymous'}`,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    })

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'Upload failed',
    }
  }
}

// ============================================
// UPLOAD AVATAR
// ============================================
export async function uploadAvatar(
  file: string,
  userId: string
): Promise<{
  success: boolean
  url?: string
  publicId?: string
  error?: string
}> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `toolvault/avatars/${userId}`,
      public_id: 'avatar',
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    })

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'Avatar upload failed',
    }
  }
}

// ============================================
// DELETE IMAGE
// ============================================
export async function deleteImage(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'Delete failed',
    }
  }
}

// ============================================
// REMOVE BACKGROUND
// ============================================
export async function removeBackground(
  imageUrl: string
): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'toolvault/processed',
      background_removal: 'cloudinary_ai',
      resource_type: 'image',
    })

    return {
      success: true,
      url: result.secure_url,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : 'Background removal failed',
    }
  }
}

// ============================================
// COMPRESS IMAGE
// ============================================
export function getCompressedUrl(
  publicId: string,
  quality: number = 60
): string {
  return cloudinary.url(publicId, {
    quality,
    fetch_format: 'auto',
    secure: true,
  })
}

// ============================================
// RESIZE IMAGE
// ============================================
export function getResizedUrl(
  publicId: string,
  width: number,
  height: number
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    fetch_format: 'auto',
    quality: 'auto',
    secure: true,
  })
}

// ============================================
// ADD WATERMARK
// ============================================
export function getWatermarkedUrl(
  publicId: string,
  watermarkText: string
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        overlay: {
          font_family: 'Arial',
          font_size: 40,
          font_weight: 'bold',
          text: watermarkText,
        },
        color: '#FFFFFF',
        opacity: 50,
        gravity: 'south_east',
        x: 20,
        y: 20,
      },
    ],
    secure: true,
  })
}

export default cloudinary
