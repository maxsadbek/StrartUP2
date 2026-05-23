import type { StationReview } from '@/types/station'

export const mockReviews: Record<string, StationReview[]> = {
  'st-001': [
    { id: 'r1', author: 'Aziz K.', rating: 5, comment: 'Fast service, clean station. AI-95 price was the best nearby.', createdAt: '2026-05-20T10:00:00Z' },
    { id: 'r2', author: 'Maria S.', rating: 4, comment: 'Good queue management. EV charging available.', createdAt: '2026-05-18T14:30:00Z' },
    { id: 'r3', author: 'Jamshid T.', rating: 5, comment: 'Taxi lane saved me 10 minutes during rush hour.', createdAt: '2026-05-15T08:15:00Z' },
  ],
  'st-003': [
    { id: 'r4', author: 'Elena P.', rating: 5, comment: 'Premium lounge is worth it. Lowest AI-95 in the area.', createdAt: '2026-05-21T16:00:00Z' },
    { id: 'r5', author: 'Rustam B.', rating: 5, comment: 'No queue at 11pm. Perfect for night drivers.', createdAt: '2026-05-19T23:45:00Z' },
  ],
}
