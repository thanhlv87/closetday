import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Outfit } from '@shared/types';
interface OutfitCardProps {
  outfit: Outfit;
  className?: string;
}
export function OutfitCard({ outfit, className }: OutfitCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link to={`/outfits/${outfit.id}`} className="block h-full">
        <Card className={cn("overflow-hidden rounded-2xl shadow-soft hover:shadow-lg transition-shadow duration-300 h-full flex flex-col", className)}>
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img
              src={outfit.images[0]}
              alt="Outfit"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 right-3">
              <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white">
                <Heart className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4 flex-grow flex flex-col justify-between">
            <div>
              <p className="font-semibold text-foreground">
                {format(new Date(outfit.date), 'EEEE, dd/MM/yyyy', { locale: vi })}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(outfit.date), 'HH:mm', { locale: vi })}
              </p>
            </div>
            {outfit.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {outfit.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}