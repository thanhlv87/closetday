import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Settings } from 'lucide-react';
import { isToday, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { OutfitCard } from '@/components/OutfitCard';
import { api } from '@/lib/api-client';
import type { Outfit } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { OutfitAnalytics } from '@/components/OutfitAnalytics';
const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['outfits-home'],
    queryFn: () => api<{ items: Outfit[] }>('/api/outfits?limit=20'), // Fetch more for analytics
  });
  const allOutfits = data?.items ?? [];
  const todayOutfit = allOutfits.find(o => isToday(new Date(o.date)));
  const pastOutfits = allOutfits.filter(o => !isToday(new Date(o.date))).slice(0, 3);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={FADE_UP_VARIANTS}
            className="text-center"
          >
            <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-mesh opacity-10 dark:opacity-20 blur-3xl -z-10" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-balance leading-tight">
              Hôm nay bạn mặc gì?
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ghi lại phong cách mỗi ngày, tạo nên câu chuyện thời trang của riêng bạn.
            </p>
          </motion.section>
          <div className="space-y-16 md:space-y-24 mt-12">
            <motion.section
              initial="hidden"
              animate="visible"
              variants={{ ...FADE_UP_VARIANTS, visible: { ...FADE_UP_VARIANTS.visible, transition: { ...FADE_UP_VARIANTS.visible.transition, delay: 0.2 }}}}
            >
              <h2 className="text-2xl font-semibold mb-4">Trang phục hôm nay</h2>
              {isLoading ? (
                <div className="max-w-sm mx-auto">
                  <Skeleton className="aspect-[3/4] rounded-2xl" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              ) : todayOutfit ? (
                <div className="max-w-sm mx-auto">
                  <OutfitCard outfit={todayOutfit} />
                </div>
              ) : (
                <Link to="/new">
                  <div className="relative block w-full rounded-2xl border-2 border-dashed border-muted-foreground/30 p-12 text-center hover:border-primary/50 transition-colors duration-300">
                    <div className="flex flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <span className="mt-4 block text-lg font-semibold text-foreground">Thêm trang phục hôm nay</span>
                      <p className="text-muted-foreground">Bạn chưa có trang phục nào cho ngày {format(new Date(), 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                </Link>
              )}
            </motion.section>
            <motion.section
              initial="hidden"
              animate="visible"
              variants={{ ...FADE_UP_VARIANTS, visible: { ...FADE_UP_VARIANTS.visible, transition: { ...FADE_UP_VARIANTS.visible.transition, delay: 0.4 }}}}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gợi ý từ qu�� khứ</h2>
                <Link to="/gallery">
                  <Button variant="ghost">Xem tất cả</Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="aspect-[3/4] rounded-2xl" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))
                ) : pastOutfits.length > 0 ? (
                  pastOutfits.map(outfit => <OutfitCard key={outfit.id} outfit={outfit} />)
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-8">Chưa có trang phục nào trong quá khứ.</p>
                )}
              </div>
            </motion.section>
            <motion.section
              initial="hidden"
              animate="visible"
              variants={{ ...FADE_UP_VARIANTS, visible: { ...FADE_UP_VARIANTS.visible, transition: { ...FADE_UP_VARIANTS.visible.transition, delay: 0.6 }}}}
            >
              <OutfitAnalytics />
            </motion.section>
          </div>
        </div>
      </div>
      <Link to="/new">
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button className="btn-gradient rounded-full h-16 w-16 shadow-lg">
            <Plus className="h-8 w-8" />
          </Button>
        </motion.div>
      </Link>
      <footer className="text-center py-8 text-muted-foreground/80">
        <p>Built with ❤�� at Cloudflare</p>
      </footer>
      <Toaster richColors />
    </div>
  );
}