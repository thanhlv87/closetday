import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { Outfit } from '@shared/types';
const COLORS = ['#F38020', '#6D28D9', '#0F172A', '#F59E0B', '#10B981', '#3B82F6'];
export function OutfitAnalytics() {
  const { data: outfitsData, isLoading } = useQuery({
    queryKey: ['outfits-all-analytics'],
    queryFn: () => api<{ items: Outfit[] }>('/api/outfits?limit=999'),
  });
  const tagFrequency = useMemo(() => {
    if (!outfitsData?.items) return [];
    const counts: { [key: string]: number } = {};
    outfitsData.items.forEach(outfit => {
      outfit.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 tags
  }, [outfitsData]);
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  if (!tagFrequency.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phân tích trang phục</CardTitle>
          <CardDescription>Thống kê các tag bạn hay sử dụng nhất.</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-16">
          Chưa có đủ dữ liệu để phân tích.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân tích trang phục</CardTitle>
        <CardDescription>Thống kê các tag bạn hay sử dụng nhất.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tagFrequency} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Số lần sử dụng" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
              {tagFrequency.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}