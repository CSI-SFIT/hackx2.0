"use client";

import { UploadDropzone } from "@uploadthing/react";
import { useState } from "react";
import { toast } from "sonner";
import type { OurFileRouter } from "@/libs/uploadthing";
import "@uploadthing/react/styles.css";

interface ProjectImageUploaderProps {
  existingImages: string[];
  newImages: string[];
  onAddImages: (urls: string[]) => void;
  onRemoveExistingImage: (index: number) => void;
  onRemoveNewImage: (index: number) => void;
  isLightMode: boolean;
  maxImages?: number;
}

export default function ProjectImageUploader({
  existingImages,
  newImages,
  onAddImages,
  onRemoveExistingImage,
  onRemoveNewImage,
  isLightMode,
  maxImages = 4,
}: ProjectImageUploaderProps) {
  const totalImages = existingImages.length + newImages.length;
  const canAddMore = totalImages < maxImages;

  return (
    <div className="space-y-4">
      <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${isLightMode ? "text-black/50" : "text-white/40"}`}>
        Project Images ({totalImages}/{maxImages})
      </label>

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <p className={`text-xs font-bold mb-2 ${isLightMode ? "text-black/70" : "text-white/70"}`}>
            Uploaded Images
          </p>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="relative group">
                <img
                  src={url}
                  alt={"Project image " + (i + 1)}
                  className={`h-20 w-20 object-cover border-[3px] ${isLightMode ? "border-black" : "border-white/30"}`}
                />
                <button
                  type="button"
                  onClick={() => onRemoveExistingImage(i)}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center border-[2px] border-black bg-[#ff00a0] text-white text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New images preview */}
      {newImages.length > 0 && (
        <div className="mb-4">
          <p className={`text-xs font-bold mb-2 ${isLightMode ? "text-black/70" : "text-white/70"}`}>
            New Images
          </p>
          <div className="flex flex-wrap gap-3">
            {newImages.map((url, i) => (
              <div key={`new-${i}`} className="relative group">
                <img
                  src={url}
                  alt={"New image " + (i + 1)}
                  className={`h-20 w-20 object-cover border-[3px] border-dashed ${isLightMode ? "border-black/50" : "border-white/20"}`}
                />
                <button
                  type="button"
                  onClick={() => onRemoveNewImage(i)}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center border-[2px] border-black bg-[#ff00a0] text-white text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload area */}
      {canAddMore ? (
        <div className={`border-[3px] border-dashed p-4 rounded-lg ${isLightMode ? "border-black/30 bg-white/50" : "border-white/20 bg-black/30"}`}>
          <UploadDropzone<OurFileRouter, "projectImageUploader">
            endpoint="projectImageUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                const urls = res.map((file) => file.url);
                onAddImages(urls);
                toast.success(`${res.length} image(s) uploaded successfully`);
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            onUploadBegin={() => {
              toast.loading("Uploading images...");
            }}
            appearance={{
              button: {
                background: isLightMode ? "#000000" : "#ffffff",
                color: isLightMode ? "#ffffff" : "#000000",
              },
              container: {
                cursor: "pointer",
              },
            }}
          />
          <p className={`text-xs mt-2 ${isLightMode ? "text-black/50" : "text-white/50"}`}>
            Max {maxImages - totalImages} image(s) remaining
          </p>
        </div>
      ) : (
        <div className={`border-[3px] border-dashed p-4 rounded-lg text-center ${isLightMode ? "border-black/30 bg-white/30" : "border-white/20 bg-black/30"}`}>
          <p className={`text-xs font-bold ${isLightMode ? "text-black/50" : "text-white/50"}`}>
            Maximum {maxImages} images reached
          </p>
        </div>
      )}
    </div>
  );
}
