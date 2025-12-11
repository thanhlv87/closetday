import type { User, Chat, ChatMessage, Outfit } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// Mock data for ClosetDay
const today = new Date();
const setDate = (date: Date, days: number, months = 0, years = 0) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  newDate.setMonth(newDate.getMonth() - months);
  newDate.setFullYear(newDate.getFullYear() - years);
  return newDate.getTime();
};
export const MOCK_OUTFITS: Outfit[] = [
  {
    id: 'outfit-1',
    date: today.getTime(),
    images: ['https://images.unsplash.com/photo-1593030103050-5421d74de948?q=80&w=1974&auto=format&fit=crop'],
    tags: ['công sở', 'mùa hè', 'nóng'],
    notes: 'Trang phục đi làm ngày thứ 2. Cảm thấy khá thoải mái và tự tin.'
  },
  {
    id: 'outfit-2',
    date: setDate(today, 1),
    images: ['https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop'],
    tags: ['dạo phố', 'cuối tu��n'],
    notes: 'Đi cafe với bạn bè.'
  },
  {
    id: 'outfit-3',
    date: setDate(today, 7),
    images: ['https://images.unsplash.com/photo-1622519407650-3df9883f76a5?q=80&w=1965&auto=format&fit=crop'],
    tags: ['thể thao', 'năng động'],
  },
  {
    id: 'outfit-4',
    date: setDate(today, 30),
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop'],
    tags: ['dự tiệc', 'sang trọng'],
    notes: 'Tiệc cưới bạn thân.'
  },
  {
    id: 'outfit-5',
    date: setDate(today, 0, 0, 1),
    images: ['https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?q=80&w=1974&auto=format&fit=crop'],
    tags: ['mùa đông', 'ấm áp'],
    notes: 'Một năm trước, trời lạnh và có mưa phùn.'
  }
];