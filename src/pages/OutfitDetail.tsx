import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit, Tag, Trash2, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MOCK_OUTFITS } from '@shared/mock-data';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from '@/components/ui/sonner';
export function OutfitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const outfit = useMemo(() => MOCK_OUTFITS.find(o => o.id === id), [id]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">Không tìm thấy trang phục.</p>
          <Button onClick={() => navigate('/gallery')} className="mt-4">Quay lại thư viện</Button>
        </div>
      </div>
    );
  }
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % outfit.images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + outfit.images.length) % outfit.images.length);
  };
  const handleDelete = () => {
    // Mock deletion
    console.log(`Deleting outfit ${outfit.id}`);
    toast.success('Đã xoá trang phục.');
    navigate('/gallery');
  };
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate('/gallery')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Chi tiết trang phục</h1>
              <p className="text-muted-foreground">{format(new Date(outfit.date), 'EEEE, dd MMMM, yyyy', { locale: vi })}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden group">
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
                  <Button size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={prevImage}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={nextImage}>
                    <ChevronRight className="h-5 w-5" />
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
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Sửa</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Xoá</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có ch���c chắn?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này không thể hoàn tác. Trang phục sẽ bị xoá vĩnh viễn.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hu��</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Tiếp tục</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Link to="/new" state={{ fromOutfit: outfit }} className="col-span-2">
                    <Button className="w-full"><Copy className="mr-2 h-4 w-4" /> Dùng lại trang phục này</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}