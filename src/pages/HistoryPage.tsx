import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Outfit } from '@shared/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OutfitCard } from '@/components/OutfitCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: (isMobile: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { staggerChildren: isMobile ? 0.05 : 0.1, duration: isMobile ? 0.2 : 0.4 },
  }),
};
export function HistoryPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const isMobile = useIsMobile();
  const { data: outfits, isLoading } = useQuery({
    queryKey: ['outfits-all'],
    queryFn: () => api<{ items: Outfit[] }>('/api/outfits?limit=999'), // Fetch all for calendar view
  });
  const allOutfits = useMemo(() => outfits?.items ?? [], [outfits]);
  const outfitDates = useMemo(() => {
    return allOutfits.map(outfit => new Date(outfit.date));
  }, [allOutfits]);
  const outfitsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return allOutfits.filter(outfit => isSameDay(new Date(outfit.date), selectedDate));
  }, [allOutfits, selectedDate]);
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={isMobile}
            variants={FADE_IN_VARIANTS}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold">Lịch sử trang phục</h1>
            <p className="text-muted-foreground mt-2">Xem lại hành tr��nh phong cách của bạn.</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.div initial="hidden" animate="visible" custom={isMobile} variants={FADE_IN_VARIANTS} className="lg:col-span-1">
              <Card>
                <CardContent className="p-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    modifiers={{ highlighted: outfitDates }}
                    modifiersClassNames={{
                      highlighted: 'bg-primary/20 text-primary-foreground rounded-full',
                    }}
                    className="p-0 w-full"
                  />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial="hidden" animate="visible" custom={isMobile} variants={FADE_IN_VARIANTS} className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Trang phục ngày {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : '...'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <Skeleton className="aspect-[3/4] rounded-2xl" />
                      <Skeleton className="aspect-[3/4] rounded-2xl hidden sm:block" />
                    </div>
                  ) : outfitsOnSelectedDate.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {outfitsOnSelectedDate.map(outfit => (
                        <OutfitCard key={outfit.id} outfit={outfit} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">Không có trang phục nào cho ngày này.</p>
                      <Button onClick={() => navigate('/new', { state: { date: selectedDate } })} className="h-11 w-full sm:w-auto">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Thêm trang phục
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}