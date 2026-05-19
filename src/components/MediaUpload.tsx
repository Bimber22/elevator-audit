"use client";

import { useRef, useState } from "react";
import { Camera, ImageIcon, FolderOpen, Trash2, Film, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { MediaFile } from "@/types";
import { uploadMedia } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";

interface MediaUploadProps {
  projectId: string;
  itemId: string;
  mediaFiles: MediaFile[];
}

// Compress image to base64 (max 1200px, JPEG 85%).
// Returns a data URL that works in any context — browser, PDF worker, other devices.
function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1200;
        const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function MediaUpload({ projectId, itemId, mediaFiles }: MediaUploadProps) {
  const addMedia = useAppStore((s) => s.addMediaToItem);
  const removeMedia = useAppStore((s) => s.removeMediaFromItem);

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const isVideo = file.type.startsWith("video/");

        // Images → compress to base64 (persistent, works in PDF and across devices)
        // Videos → upload to Supabase Storage (too large for base64)
        const url = isVideo
          ? await uploadMedia(file, projectId)
          : await compressImage(file);

        addMedia(projectId, itemId, {
          id: uuidv4(),
          url,
          name: file.name,
          type: isVideo ? "video" : "image",
        });
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {/* Thumbnails */}
      {mediaFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {mediaFiles.map((m) => (
            <div key={m.id} className="relative group w-20 h-20">
              {m.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.url}
                  alt={m.name}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                  <Film size={20} className="text-gray-500" />
                  <span className="text-[10px] text-gray-500 mt-1 px-1 truncate w-full text-center">
                    {m.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => removeMedia(projectId, itemId, m.id)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover mídia"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {uploading ? (
        <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-gray-500">
          <Loader2 size={16} className="animate-spin" />
          Processando…
        </div>
      ) : (
        <div className="flex gap-2">
          <UploadButton icon={<Camera size={16} />} label="Câmera" onClick={() => cameraRef.current?.click()} />
          <UploadButton icon={<ImageIcon size={16} />} label="Galeria" onClick={() => galleryRef.current?.click()} />
          <UploadButton icon={<FolderOpen size={16} />} label="Arquivo" onClick={() => fileRef.current?.click()} />
        </div>
      )}

      {/* Camera — forces native camera */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFiles} className="hidden" />
      {/* Gallery — photo/video library */}
      <input ref={galleryRef} type="file" accept="image/*,video/*" multiple onChange={handleFiles} className="hidden" />
      {/* Files — full file manager */}
      <input ref={fileRef} type="file" accept="image/*,video/*,application/pdf" multiple onChange={handleFiles} className="hidden" />
    </div>
  );
}

function UploadButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-xs hover:border-blue-400 hover:text-blue-500 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}
