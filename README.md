# ClosetDay — Nhật ký phối đồ

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thanhlv87/closetday)

ClosetDay is a modern web application designed to help users capture, upload, and organize their daily outfits. It serves as a personal outfit journal, allowing users to take photos or upload images of their daily attire, add tags and metadata, store them by date, and browse through their wardrobe history across days, weeks, months, and years. Built with a minimalist aesthetic emphasizing clean whitespace, warm gradients, and smooth mobile-first interactions, ClosetDay provides an intuitive experience for fashion enthusiasts to track and revisit their style choices.

## Features

- **Daily Outfit Capture**: Use device camera or upload photos directly in the app for quick logging.
- **Tagging and Metadata**: Add occasions, weather, notes, and multiple images (e.g., front/back views) to each outfit.
- **Gallery View**: Browse outfits in a responsive grid or timeline, with filters by date, tags, or occasions.
- **Outfit Details**: View full details with image carousels, edit options, delete, and "reuse" functionality to inspire new outfits.
- **History and Calendar**: Navigate through past outfits by day, week, month, or year with easy calendar integration.
- **Dashboard Home**: Welcoming interface showing today's outfit, quick-add CTA, and suggestions from previous periods.
- **Responsive Design**: Optimized for mobile devices with touch-friendly interactions and flawless desktop scaling.
- **Data Persistence**: Initial mock data for demos; extensible to Cloudflare Durable Objects for real storage.
- **Visual Excellence**: Smooth micro-interactions, loading states, and toast notifications for delightful UX.

## Tech Stack

- **Frontend**: React 18, React Router, shadcn/ui (Radix UI primitives), Tailwind CSS v3, framer-motion for animations.
- **Icons & UI**: Lucide React icons, Sonner for toasts.
- **State & Data**: Zustand for lightweight state management, TanStack React Query for caching and mutations.
- **Backend**: Hono for API routing, Cloudflare Workers for serverless execution.
- **Storage**: Cloudflare Durable Objects for persistent data storage via custom entity patterns.
- **Utilities**: date-fns for date handling, uuid for IDs, react-use for hooks.
- **Build & Dev**: Vite for fast bundling, Bun for package management, TypeScript for type safety.
- **Charts (Optional)**: Recharts for outfit analytics in future phases.

## Quick Start

### Prerequisites

- Node.js (v18+) or Bun installed.
- Cloudflare account for deployment (free tier sufficient).
- Wrangler CLI: Install via `bun install -g wrangler`.

### Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd closetday
   ```

2. Install dependencies using Bun:
   ```
   bun install
   ```

3. (Optional) Generate TypeScript types for Workers:
   ```
   bun run cf-typegen
   ```

The project is now ready for development or deployment.

## Development

### Running Locally

Start the development server:
```
bun run dev
```

The app will be available at `http://localhost:3000` (or the port specified in your environment).

- Frontend: Hot-reloads on changes.
- Backend: Cloudflare Workers simulate via Wrangler; API endpoints at `/api/*`.
- Mock Data: Seeded automatically for testing (see `shared/mock-data.ts`).

### Key Development Notes

- **API Endpoints**: Extend `/api/outfits` in `worker/user-routes.ts` for CRUD operations. Use `api-client.ts` in frontend for calls.
- **Entities**: Define custom entities like `OutfitEntity` extending `IndexedEntity` in `worker/entities.ts`.
- **State Management**: Use Zustand with primitive selectors to avoid re-render loops (e.g., `useStore(s => s.count)`).
- **UI Components**: Leverage shadcn/ui for forms, cards, sheets, etc. Import from `@/components/ui/*`.
- **Theming**: Dark/light mode via `useTheme` hook; toggle with `ThemeToggle` component.
- **Linting**: Run `bun run lint` for code quality checks.
- **Testing**: Add unit tests for components; integration tests via React Query mocks.

### Environment Variables

No custom env vars required for basic setup. For production, configure via Wrangler secrets:
```
wrangler secret put YOUR_SECRET
```

## Usage

### Core User Flows

1. **Add a New Outfit**:
   - Navigate to the "New Outfit" editor.
   - Capture via camera or upload images.
   - Add tags (e.g., occasion: "Work", weather: "Sunny"), notes, and date (defaults to today).
   - Save to persist in local mock storage (Phase 1) or backend (Phase 2+).

2. **Browse Gallery**:
   - View outfits in a grid layout.
   - Filter by date range, tags, or search notes.
   - Switch to timeline mode for chronological browsing.

3. **View Details**:
   - Click an outfit card to open the detail view.
   - Browse images in a carousel.
   - Edit metadata, delete, or reuse for a new entry.

4. **History Navigation**:
   - Use the calendar view to jump to specific dates.
   - See highlighted days with outfits; add new ones on empty dates.

### API Integration (Phase 2+)

Frontend queries mock data initially. Replace with real calls:
```tsx
// Example: Fetch outfits
const { data: outfits } = useQuery({
  queryKey: ['outfits'],
  queryFn: () => api<{ items: Outfit[]; next?: string }>('/api/outfits'),
});
```

Endpoints:
- `GET /api/outfits?cursor&limit`: List outfits.
- `POST /api/outfits`: Create with metadata and base64 images.
- `GET /api/outfits/:id`: Fetch details.
- `DELETE /api/outfits/:id`: Remove outfit.

## Deployment

Deploy to Cloudflare Workers for global, edge-distributed hosting:

1. Login to Wrangler:
   ```
   wrangler login
   ```

2. Publish:
   ```
   bun run deploy
   ```

   This builds the frontend (Vite) and deploys the Worker bundle, including assets for SPA routing.

3. Access your app at the provided Worker URL (e.g., `https://closetday.your-subdomain.workers.dev`).

For custom domains:
```
wrangler pages publish --project-name=your-project dist
```
(Adjust for Pages if using static assets.)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thanhlv87/closetday)

### Production Tips

- **Image Handling**: Compress uploads client-side (e.g., via Canvas API) to respect Durable Object limits (~2MB per image).
- **Scaling**: Offload large images to Cloudflare R2 in future iterations.
- **Monitoring**: Use Cloudflare Analytics for usage insights.
- **Migrations**: Review `wrangler.jsonc` for Durable Object schema updates.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

We welcome contributions that enhance UI polish, add features like analytics, or improve backend scalability. Please adhere to TypeScript standards and test thoroughly.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.