// TypeScript interfaces for Search API

export interface CaregiverSearchItem {
  id: number;
  displayName?: string | null;
  profilePhotoUrl?: string | null;
  province?: string | null;
  languages?: string | null;
  servicesOffered?: string | null;
  specializations?: string | null;
  yearsOfExperience?: number | null;
  age?: number | null;
  profileCompletionPercentage?: number | null;
  totalRating?: number | null;
  totalReviews?: number | null;
}

export interface SearchResultsDto<TItem> {
  items: TItem[];
  total: number;
  page: number;
  size: number;
}


