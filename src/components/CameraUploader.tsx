import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
interface CameraUploaderProps {
  onImagesChange: (files: File[]) => void;
  className?: string;
}
export function CameraUploader({ onImagesChange, className }: CameraUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      const updatedFiles = [...files, ...newFiles];
      const updatedPreviews = [...previews, ...newPreviews];
      setFiles(updatedFiles);
      setPreviews(updatedPreviews);
      onImagesChange(updatedFiles);
    }
    // Simulate processing time
    setTimeout(() => setIsLoading(false), 500);
  }, [files, previews, onImagesChange]);
  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(previews[index]);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onImagesChange(updatedFiles);
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
        {previews.map((src, index) => (
          <div key={index} className="relative group aspect-[3/4] rounded-lg overflow-hidden">
            <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
        {isLoading && <Skeleton className="aspect-[3/4] rounded-lg" />}
      </div>
      <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <Camera className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Chụp ảnh hoặc tải lên từ thiết bị</p>
          <Button onClick={triggerFileInput} className="mt-4 h-12 min-h-[44px] px-6 text-base">
            <Upload className="mr-2 h-5 w-5" /> Chọn ảnh
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>
      </div>
    </div>
  );
}