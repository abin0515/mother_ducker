'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  SectionContainer, Section, SectionHeaderLayout, SectionTitle, SectionContent,
  Card, CardContent, CardHeader, CardTitle, Badge, Button, Form, FormField, FormLabel, FormActions,
  LanguageSelector, ServiceSelector, SpecializationSelector, ProvinceSelector, Input, Pagination, PaginationInfo,
  Tabs, TabsList, TabsTrigger, Alert, LoadingOverlay
} from '@/components/ui';

import { apiService } from '@/lib/api';

interface Labels {
  title: string;
  filters: string;
  apply: string;
  reset: string;
  results: string;
  empty: string;
  province: string;
  languages: string;
  services: string;
  specializations: string;
  minExperience: string;
  ageMin: string;
  ageMax: string;
  sortRelevance: string;
  sortNewest: string;
  sortExperience: string;
  loading: string;
  badgeAge: string;
  badgeYears: string;
}

interface Props { locale: string; labels: Labels; }

export default function SearchPageClient({ locale, labels }: Props) {
  const [province, setProvince] = useState<string>('');
  const [languages, setLanguages] = useState<string>('');
  const [services, setServices] = useState<string>('');
  const [specializations, setSpecializations] = useState<string>('');
  const [minExperience, setMinExperience] = useState<number | undefined>(undefined);
  const [ageMin, setAgeMin] = useState<number | undefined>(undefined);
  const [ageMax, setAgeMax] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string>('relevance');
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (province) params.set('province', province);
    if (languages) params.set('languages', languages);
    if (services) params.set('services', services);
    if (specializations) params.set('specializations', specializations);
    if (minExperience !== undefined) params.set('minExperience', String(minExperience));
    if (ageMin !== undefined) params.set('ageMin', String(ageMin));
    if (ageMax !== undefined) params.set('ageMax', String(ageMax));
    params.set('page', String(page));
    params.set('size', String(size));
    params.set('sort', sort);
    return params.toString();
  }, [province, languages, services, specializations, minExperience, ageMin, ageMax, page, size, sort]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get<{ items: any[]; total: number; page: number; size: number }>(`/api/v1/users/search/caregivers?${queryString}`);
      setItems(res?.items ?? []);
      setTotal(res?.total ?? 0);
    } catch (e: any) {
      setError(e?.message || 'Failed to load search results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const onApply = () => {
    setPage(0);
    // basic analytics: filters applied
    try { window.dispatchEvent(new CustomEvent('analytics:search:apply', { detail: { province, languages, services, specializations, minExperience, ageMin, ageMax, sort } })); } catch {}
    fetchResults();
  };

  const onReset = () => {
    setProvince('');
    setLanguages('');
    setServices('');
    setSpecializations('');
    setMinExperience(undefined);
    setAgeMin(undefined);
    setAgeMax(undefined);
    setSort('relevance');
    setPage(0);
    try { window.dispatchEvent(new CustomEvent('analytics:search:reset')); } catch {}
  };

  return (
    <SectionContainer>
      <Section>
        <SectionHeaderLayout>
          <SectionTitle>{labels.title}</SectionTitle>
        </SectionHeaderLayout>
        <SectionContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-card">
            <div className="lg:col-span-1">
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <CardTitle>{labels.filters}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form>
                    <FormField>
                      <FormLabel>{labels.province}</FormLabel>
                      <ProvinceSelector value={province} onChange={setProvince} />
                    </FormField>
                    <FormField>
                      <FormLabel>{labels.languages}</FormLabel>
                      <LanguageSelector value={languages} onChange={setLanguages} />
                    </FormField>
                    <FormField>
                      <FormLabel>{labels.services}</FormLabel>
                      <ServiceSelector value={services} onChange={setServices} />
                    </FormField>
                    <FormField>
                      <FormLabel>{labels.specializations}</FormLabel>
                      <SpecializationSelector value={specializations} onChange={setSpecializations} />
                    </FormField>
                    <FormField>
                      <FormLabel>{labels.minExperience}</FormLabel>
                      <Input type="number" value={minExperience ?? ''} onChange={(e) => setMinExperience(e.target.value ? Number(e.target.value) : undefined)} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-medical-md">
                      <FormField>
                        <FormLabel>{labels.ageMin}</FormLabel>
                        <Input type="number" value={ageMin ?? ''} onChange={(e) => setAgeMin(e.target.value ? Number(e.target.value) : undefined)} />
                      </FormField>
                      <FormField>
                        <FormLabel>{labels.ageMax}</FormLabel>
                        <Input type="number" value={ageMax ?? ''} onChange={(e) => setAgeMax(e.target.value ? Number(e.target.value) : undefined)} />
                      </FormField>
                    </div>
                    <FormActions>
                      <Button variant="primary" onClick={onApply}>{labels.apply}</Button>
                      <Button variant="ghost" onClick={onReset}>{labels.reset}</Button>
                    </FormActions>
                  </Form>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3 relative">
              <Card variant="elevated" padding="lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{labels.results}</CardTitle>
                    <Tabs defaultValue={sort}>
                      <TabsList>
                        <TabsTrigger value="relevance" onClick={() => setSort('relevance')}>{labels.sortRelevance}</TabsTrigger>
                        <TabsTrigger value="newest" onClick={() => setSort('newest')}>{labels.sortNewest}</TabsTrigger>
                        <TabsTrigger value="experience" onClick={() => setSort('experience')}>{labels.sortExperience}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {loading && (
                      <LoadingOverlay isLoading message={labels.loading}>
                        <div />
                      </LoadingOverlay>
                    )}
                    {error && (
                      <Alert variant="error">{error}</Alert>
                    )}
                    {!loading && !error && items.length === 0 && (
                      <Alert variant="info">{labels.empty}</Alert>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-card">
                      {items.map((it) => (
                        <Card key={it.id} variant="outlined" padding="lg">
                          <CardHeader>
                            <CardTitle level={4}>{it.displayName ?? 'Unknown'}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {it.province && <Badge variant="info">{it.province}</Badge>}
                              {typeof it.age === 'number' && <Badge variant="info">{labels.badgeAge} {it.age}</Badge>}
                              {typeof it.yearsOfExperience === 'number' && <Badge variant="success">{it.yearsOfExperience} {labels.badgeYears}</Badge>}
                            </div>
                            <div className="mt-2 text-secondary-600 text-medical-sm line-clamp-3">
                              {it.specializations || it.servicesOffered || it.languages}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="mt-card flex items-center justify-between">
                      <PaginationInfo currentPage={page + 1} itemsPerPage={size} totalItems={total} totalPages={Math.ceil(total / size)} />
                      <Pagination
                        currentPage={page + 1}
                        totalPages={Math.ceil(total / size)}
                        onPageChange={(p) => { try { window.dispatchEvent(new CustomEvent('analytics:search:page', { detail: { page: p } })); } catch {}; setPage(p - 1); }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SectionContent>
      </Section>
    </SectionContainer>
  );
}


