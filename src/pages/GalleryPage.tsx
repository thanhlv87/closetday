import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, List, Search, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { OutfitCard } from '@/components/OutfitCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Outfit } from '@shared/types';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useDebounce } from 'react-use';
const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};
export function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['outfits'],
    queryFn: ({ pageParam = null }) => api<{ items: Outfit[]; next: string | null }>(`/api/outfits?cursor=${pageParam || ''}&limit=12`),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next,
  });
  const allOutfits = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const filteredOutfits = useMemo(() => {
    let sorted = [...allOutfits];
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => b.date - a.date);
    } else {
      sorted.sort((a, b) => a.date - b.date);
    }
    if (!debouncedSearchTerm) return sorted;
    return sorted.filter(outfit =>
      outfit.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      outfit.notes?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [allOutfits, debouncedSearchTerm, sortOrder]);
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
              <p className="text-muted-foreground mt-2">Nơi lưu giữ tất cả khoảnh kh���c thời trang của bạn.</p>
            </div>
            <div className="flex gap-2">
              <Link to="/history">
                <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Xem lịch</Button>
              </Link>
              <Link to="/new">
                <Button className="btn-gradient">Thêm trang phục mới</Button>
              </Link>
            </div>
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
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
              <ToggleGroupItem value="grid"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
              <ToggleGroupItem value="list"><List className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
          </motion.div>
          {status === 'pending' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="space-y-2">
                  <Skeleton className="aspect-[3/4] rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : status === 'error' ? (
            <div className="text-center text-destructive">Error: {error.message}</div>
          ) : (
            <AnimatePresence>
              <motion.div
                layout
                className={viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                  : "space-y-4 max-w-2xl mx-auto"
                }
              >
                {filteredOutfits.map((outfit) => (
                  <motion.div layout key={outfit.id} initial="hidden" animate="visible" exit="hidden" variants={FADE_IN_VARIANTS}>
                    <OutfitCard outfit={outfit} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          <div className="mt-12 text-center">
            {hasNextPage && (
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
              </Button>
            )}
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}