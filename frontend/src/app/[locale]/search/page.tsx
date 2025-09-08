import SearchPageClient from '@/app/[locale]/search/searchClient';
import { getTranslations, type Locale } from '@/lib/i18n';

interface PageProps {
  params: { locale: Locale };
}

export default async function SearchPage({ params }: PageProps) {
  const { locale } = params;
  const t = getTranslations(locale) as any;

  return (
    <SearchPageClient locale={locale} labels={{
      title: t.search?.title ?? 'Caregiver Search',
      filters: t.search?.filters ?? 'Filters',
      apply: t.common?.apply ?? 'Apply',
      reset: t.common?.reset ?? 'Reset',
      results: t.search?.results ?? 'Results',
      empty: t.search?.empty ?? 'No caregivers match your filters',
      province: t.search?.province ?? 'Province',
      languages: t.search?.languages ?? 'Languages',
      services: t.search?.services ?? 'Services',
      specializations: t.search?.specializations ?? 'Specializations',
      minExperience: t.search?.minExperience ?? 'Min Experience (years)',
      ageMin: t.search?.ageMin ?? 'Age Min',
      ageMax: t.search?.ageMax ?? 'Age Max',
      sortRelevance: t.search?.sortRelevance ?? 'Relevance',
      sortNewest: t.search?.sortNewest ?? 'Newest',
      sortExperience: t.search?.sortExperience ?? 'Experience',
      loading: t.common?.loading ?? 'Loading results...',
      badgeAge: t.search?.badgeAge ?? 'Age',
      badgeYears: t.search?.badgeYears ?? 'yrs'
    }} />
  );
}


