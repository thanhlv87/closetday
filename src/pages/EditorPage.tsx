import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, Tag, Save, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CameraUploader } from '@/components/CameraUploader';
import { Toaster, toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Outfit } from '@shared/types';
import imageCompression from 'browser-image-compression';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
type NewOutfitPayload = Omit<Outfit, 'id'>;
export function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const fromOutfit = location.state?.fromOutfit as Outfit | undefined;
  const fromDate = location.state?.date as Date | undefined;
  const [date, setDate] = useState<Date | undefined>(fromOutfit?.date ? new Date(fromOutfit.date) : fromDate ?? new Date());
  const [tags, setTags] = useState<string[]>(fromOutfit?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [notes, setNotes] = useState(fromOutfit?.notes || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  useEffect(() => {
    if (fromOutfit) {
      toast.info('Dữ liệu trang phục đã được điền sẵn. Hãy thêm ảnh mới!');
    }
  }, [fromOutfit]);
  const handleImagesChange = (files: File[]) => {
    files.forEach(file => {
      if (file.size > 1 * 1024 * 1024) { // 1MB
        toast.warning(`Ảnh "${file.name}" có dung lượng lớn và sẽ được nén.`, { duration: 5000 });
      }
    });
    setImageFiles(files);
  };
  const saveMutation = useMutation({
    mutationFn: async (newOutfit: NewOutfitPayload) => {
      const compressedImages = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const options = {
              maxSizeMB: 1.5,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
              reader.readAsDataURL(compressedFile);
            });
          } catch (error) {
            toast.error('Lỗi nén ảnh.');
            throw error;
          }
        })
      );
      return api<Outfit>('/api/outfits', {
        method: 'POST',
        body: JSON.stringify({ ...newOutfit, images: compressedImages }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      queryClient.invalidateQueries({ queryKey: ['outfits-all'] });
      queryClient.invalidateQueries({ queryKey: ['outfits-home'] });
      toast.success('Lưu trang phục thành công!');
      setTimeout(() => navigate('/gallery'), 1000);
    },
    onError: (error) => {
      toast.error(`Lưu thất bại: ${error.message}`);
    },
  });
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const handleSave = () => {
    if (imageFiles.length === 0) {
      toast.error('Vui lòng thêm ít nhất một ảnh.');
      return;
    }
    if (!date) {
      toast.error('Vui lòng chọn ngày.');
      return;
    }
    saveMutation.mutate({
      date: date.getTime(),
      images: [], // Placeholder, will be replaced by compressed base64
      tags,
      notes,
    });
  };
  if (saveMutation.isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Skeleton className="h-16 w-16 rounded-full mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Đang xử lý và lưu...</h2>
        <p className="text-muted-foreground">Vui lòng chờ trong giây lát.</p>
        <Skeleton className="h-2 w-64 mt-4 rounded-full" />
      </div>
    );
  }
  return (
    <div className={cn("min-h-screen bg-background", isMobile && "pb-24")}>
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-11 w-11">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              {fromOutfit ? 'Dùng lại trang phục' : 'Trang phục mới'}
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Ảnh</h2>
              <CameraUploader onImagesChange={handleImagesChange} />
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Thông tin</h2>
              <div>
                <label className="font-medium">Ngày</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2 h-11 text-base",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="font-medium">Tags</label>
                <div className="flex items-center border rounded-md mt-2 min-h-11">
                  <Tag className="h-5 w-5 text-muted-foreground mx-3" />
                  <div className="flex flex-wrap gap-2 p-2 flex-grow">
                    {tags.map(tag => (
                      <span key={tag} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-2 text-muted-foreground hover:text-foreground">
                          &times;
                        </button>
                      </span>
                    ))}
                    <Input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Thêm tag..."
                      className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow h-auto p-0 text-base"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="font-medium">Ghi chú</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thời tiết h��m nay, cảm nhận của bạn..."
                  className="mt-2 min-h-28 text-base"
                />
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saveMutation.isPending} 
                className={cn(
                  "w-full btn-gradient h-12 text-lg md:static",
                  isMobile && "fixed bottom-4 left-4 right-4 z-40"
                )}
              >
                <Save className="mr-2 h-5 w-5" />
                Lưu trang phục
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}