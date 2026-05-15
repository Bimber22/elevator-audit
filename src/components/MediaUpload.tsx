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
        const url = await uploadMedia(file, projectId);
        addMedia(projectId, itemId, {
          id: uuidv4(),
          url,
          name: file.name,
          type: file.type.startsWith("video/") ? "video" : "image",
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
          Enviando...
        </div>
      ) : (
        <div className="flex gap-2">
          <UploadButton
            icon={<Camera size={16} />}
            label="Câmera"
            onClick={() => cameraRef.current?.click()}
          />
          <UploadButton
            icon={<ImageIcon size={16} />}
            label="Galeria"
            onClick={() => galleryRef.current?.click()}
          />
          <UploadButton
            icon={<FolderOpen size={16} />}
            label="Arquivo"
            onClick={() => fileRef.current?.click()}
          />
        </div>
      )}

      {/* Camera — forces native camera directly */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFiles}
        className="hidden"
      />

      {/* Gallery — opens photo/video library on mobile */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      {/* Files — opens full file manager */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  );
}

function UploadButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
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
