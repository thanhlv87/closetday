import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Tag, Trash2, Copy, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { format, subYears } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Outfit } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { OutfitCard } from '@/components/OutfitCard';
export function OutfitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: outfit, isLoading, isError } = useQuery({
    queryKey: ['outfit', id],
    queryFn: () => api<Outfit>(`/api/outfits/${id}`),
    enabled: !!id,
  });
  const { data: relatedOutfitsData } = useQuery({
    queryKey: ['outfits-related', id],
    queryFn: () => api<{ items: Outfit[] }>('/api/outfits?limit=999'),
    enabled: !!outfit,
  });
  const sameDayLastYearOutfit = React.useMemo(() => {
    if (!outfit || !relatedOutfitsData?.items) return null;
    const lastYearDate = subYears(new Date(outfit.date), 1);
    return relatedOutfitsData.items.find(o =>
      new Date(o.date).getDate() === lastYearDate.getDate() &&
      new Date(o.date).getMonth() === lastYearDate.getMonth() &&
      new Date(o.date).getFullYear() === lastYearDate.getFullYear()
    );
  }, [outfit, relatedOutfitsData]);
  const deleteMutation = useMutation({
    mutationFn: () => api(`/api/outfits/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] });
      toast.success('Đã xoá trang phục.');
      navigate('/gallery');
    },
    onError: (error) => {
      toast.error(`Xoá thất bại: ${error.message}`);
    },
  });
  const nextImage = () => outfit && setCurrentImageIndex((prev) => (prev + 1) % outfit.images.length);
  const prevImage = () => outfit && setCurrentImageIndex((prev) => (prev - 1 + outfit.images.length) % outfit.images.length);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  } as any);
  const handleExport = () => {
    if (!outfit) return;
    const dataStr = JSON.stringify(outfit, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `outfit_${outfit.id}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-10 w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-[3/4] rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isError || !outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">Không tìm thấy trang phục.</p>
          <Button onClick={() => navigate('/gallery')} className="mt-4 h-11">Quay lại thư vi��n</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate('/gallery')} className="h-11 w-11">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Chi tiết trang phục</h1>
              <p className="text-muted-foreground">{format(new Date(outfit.date), 'EEEE, dd MMMM, yyyy', { locale: vi })}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div {...swipeHandlers} className="relative aspect-square md:aspect-[3/4] rounded-2xl overflow-hidden group cursor-grab active:cursor-grabbing">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentImageIndex}
                  src={outfit.images[currentImageIndex]}
                  alt={`Outfit image ${currentImageIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {outfit.images.length > 1 && (
                <>
                  <Button size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity h-11 w-11" onClick={prevImage}>
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity h-11 w-11" onClick={nextImage}>
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-muted-foreground mt-1 mr-3 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {outfit.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </div>
                  {outfit.notes && (
                    <p className="text-muted-foreground italic">"{outfit.notes}"</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={handleExport} className="w-full h-11"><Download className="mr-2 h-4 w-4" /> Xuất</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={deleteMutation.isPending} className="w-full h-11"><Trash2 className="mr-2 h-4 w-4" /> {deleteMutation.isPending ? 'Đang xoá...' : 'Xoá'}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Trang phục sẽ bị xoá vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-11">Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate()} className="h-11">Tiếp tục</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Link to="/new" state={{ fromOutfit: outfit }} className="col-span-1 md:col-span-2">
                    <Button className="w-full h-11"><Copy className="mr-2 h-4 w-4" /> Dùng lại trang phục này</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
          {sameDayLastYearOutfit && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold mb-4">Cùng ngày này năm ngoái</h2>
              <div className="max-w-sm">
                <OutfitCard outfit={sameDayLastYearOutfit} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}