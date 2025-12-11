import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Tag, Save, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CameraUploader } from '@/components/CameraUploader';
import { Toaster, toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
export function EditorPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
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
    if (images.length === 0) {
      toast.error('Vui lòng thêm ít nhất một ảnh.');
      return;
    }
    if (!date) {
      toast.error('Vui lòng chọn ngày.');
      return;
    }
    setIsSaving(true);
    // In a real app, you'd upload files and send data to the backend.
    // Here, we just simulate a save.
    const newOutfit = {
      id: uuidv4(),
      date: date.getTime(),
      images: images.map(file => URL.createObjectURL(file)), // For demo purposes
      tags,
      notes,
    };
    console.log('Saving outfit:', newOutfit);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Lưu trang phục thành công!');
      navigate('/gallery');
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Trang phục mới</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Ảnh</h2>
              <CameraUploader onImagesChange={setImages} />
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
                        "w-full justify-start text-left font-normal mt-2",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Chọn ngày</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="font-medium">Tags</label>
                <div className="flex items-center border rounded-md mt-2">
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
                      className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow h-auto p-0"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="font-medium">Ghi chú</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thời tiết hôm nay, cảm nhận của bạn..."
                  className="mt-2"
                />
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="w-full btn-gradient">
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Đang lưu...' : 'Lưu trang phục'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}