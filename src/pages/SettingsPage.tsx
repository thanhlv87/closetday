import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Download, Image, LogOut } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Outfit } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast, Toaster } from '@/components/ui/sonner';
const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
};
export function SettingsPage() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem('closetday_user');
    if (storedUser) {
      setUsername(storedUser);
      setIsLoggedIn(true);
    }
  }, []);
  const { data: outfitsData } = useQuery({
    queryKey: ['outfits-all-export'],
    queryFn: () => api<{ items: Outfit[] }>('/api/outfits?limit=999'),
    enabled: isLoggedIn, // Only fetch when logged in
  });
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('closetday_user', username.trim());
      setIsLoggedIn(true);
      toast.success(`Chào m���ng trở lại, ${username.trim()}!`);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('closetday_user');
    setUsername('');
    setIsLoggedIn(false);
    toast.info('Bạn đã đăng xuất.');
  };
  const handleExport = () => {
    if (!outfitsData || !outfitsData.items) {
      toast.error('Không có dữ liệu để xuất.');
      return;
    }
    const dataStr = JSON.stringify(outfitsData.items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `closetday_export_${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Dữ liệu đã được xuất thành công!');
  };
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_VARIANTS}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold">Cài đặt</h1>
            <p className="text-muted-foreground mt-2">Quản lý tài khoản và dữ liệu của bạn.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_IN_VARIANTS}
            className="space-y-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><User className="mr-2" /> Tài khoản</CardTitle>
                <CardDescription>
                  {isLoggedIn ? `Bạn đang đăng nhập với t��n ${username}.` : 'Đăng nhập để sử dụng các tính năng nâng cao.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <form onSubmit={handleLogin} className="flex items-end gap-4">
                    <div className="flex-grow">
                      <Label htmlFor="username">Tên của bạn</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên của bạn..."
                      />
                    </div>
                    <Button type="submit">Lưu</Button>
                  </form>
                ) : (
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </Button>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Download className="mr-2" /> Quản lý dữ liệu</CardTitle>
                <CardDescription>Xuất tất cả dữ liệu trang phục của bạn ra file JSON.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleExport} disabled={!isLoggedIn || !outfitsData}>
                  <Download className="mr-2 h-4 w-4" /> Xuất dữ liệu
                </Button>
                {!isLoggedIn && <p className="text-sm text-muted-foreground mt-2">Vui lòng đăng nhập để xuất dữ liệu.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Image className="mr-2" /> Tối ưu h��nh ảnh</CardTitle>
                <CardDescription>Lưu ý để có trải nghiệm tốt nhất.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Để đảm bảo ứng dụng hoạt động nhanh và mượt, hình ảnh bạn tải lên sẽ được tự động nén nếu có dung lượng lớn. Chúng tôi khuyến khích sử dụng ảnh dưới 2MB.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
}