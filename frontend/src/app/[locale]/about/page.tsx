import { getTranslations, type Locale } from '@/lib/i18n';

interface AboutPageProps {
  params: {
    locale: Locale;
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {t.about.title}
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {t.about.mission}
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {t.about.missionText}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t.about.values}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">{t.about.quality}</h4>
                  <p className="text-blue-700 text-sm">{t.about.qualityText}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">{t.about.trust}</h4>
                  <p className="text-blue-700 text-sm">{t.about.trustText}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">{t.about.support}</h4>
                  <p className="text-blue-700 text-sm">{t.about.supportText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
