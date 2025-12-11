import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { OutfitCard } from '@/components/OutfitCard';
import { MOCK_OUTFITS } from '@shared/mock-data';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
export function GalleryPage() {
  const [outfits, setOutfits] = useState(MOCK_OUTFITS.sort((a, b) => b.date - a.date));
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const filteredOutfits = useMemo(() => {
    let sorted = [...outfits];
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => b.date - a.date);
    } else {
      sorted.sort((a, b) => a.date - b.date);
    }
    if (!searchTerm) return sorted;
    return sorted.filter(outfit =>
      outfit.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      outfit.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [outfits, searchTerm, sortOrder]);
  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      // This is a mock, in a real app you'd fetch more data
      setIsLoading(false);
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_VARIANTS}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold">Thư viện trang phục</h1>
              <p className="text-muted-foreground mt-2">Nơi lưu giữ tất cả khoảnh khắc thời trang của bạn.</p>
            </div>
            <Link to="/new">
              <Button className="btn-gradient">Thêm trang phục mới</Button>
            </Link>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_VARIANTS}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tag hoặc ghi chú..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {filteredOutfits.map((outfit) => (
                <motion.div layout key={outfit.id} initial="hidden" animate="visible" exit="hidden" variants={FADE_IN_VARIANTS}>
                  <OutfitCard outfit={outfit} />
                </motion.div>
              ))}
              {isLoading && Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="space-y-2">
                  <Skeleton className="aspect-[3/4] rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="mt-12 text-center">
            <Button onClick={loadMore} variant="outline" disabled={isLoading}>
              {isLoading ? 'Đang tải...' : 'Tải thêm'}
            </Button>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}