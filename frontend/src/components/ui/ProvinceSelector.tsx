'use client';
import { getTranslations, Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export interface ProvinceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ProvinceSelector({
  value,
  onChange,
  placeholder,
  className = ''
}: ProvinceSelectorProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = getTranslations(locale);

  // All provinces and autonomous regions in China
  const chineseProvinces = [
    { key: 'beijing', label: t.profile.provinces.beijing },
    { key: 'tianjin', label: t.profile.provinces.tianjin },
    { key: 'hebei', label: t.profile.provinces.hebei },
    { key: 'shanxi', label: t.profile.provinces.shanxi },
    { key: 'innermongolia', label: t.profile.provinces.innermongolia },
    { key: 'liaoning', label: t.profile.provinces.liaoning },
    { key: 'jilin', label: t.profile.provinces.jilin },
    { key: 'heilongjiang', label: t.profile.provinces.heilongjiang },
    { key: 'shanghai', label: t.profile.provinces.shanghai },
    { key: 'jiangsu', label: t.profile.provinces.jiangsu },
    { key: 'zhejiang', label: t.profile.provinces.zhejiang },
    { key: 'anhui', label: t.profile.provinces.anhui },
    { key: 'fujian', label: t.profile.provinces.fujian },
    { key: 'jiangxi', label: t.profile.provinces.jiangxi },
    { key: 'shandong', label: t.profile.provinces.shandong },
    { key: 'henan', label: t.profile.provinces.henan },
    { key: 'hubei', label: t.profile.provinces.hubei },
    { key: 'hunan', label: t.profile.provinces.hunan },
    { key: 'guangdong', label: t.profile.provinces.guangdong },
    { key: 'guangxi', label: t.profile.provinces.guangxi },
    { key: 'hainan', label: t.profile.provinces.hainan },
    { key: 'chongqing', label: t.profile.provinces.chongqing },
    { key: 'sichuan', label: t.profile.provinces.sichuan },
    { key: 'guizhou', label: t.profile.provinces.guizhou },
    { key: 'yunnan', label: t.profile.provinces.yunnan },
    { key: 'tibet', label: t.profile.provinces.tibet },
    { key: 'shaanxi', label: t.profile.provinces.shaanxi },
    { key: 'gansu', label: t.profile.provinces.gansu },
    { key: 'qinghai', label: t.profile.provinces.qinghai },
    { key: 'ningxia', label: t.profile.provinces.ningxia },
    { key: 'xinjiang', label: t.profile.provinces.xinjiang },
    { key: 'hongkong', label: t.profile.provinces.hongkong },
    { key: 'macau', label: t.profile.provinces.macau },
    { key: 'taiwan', label: t.profile.provinces.taiwan }
  ];

  return (
    <div className={`province-selector ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
      >
        <option value="">
          {placeholder || t.profile.placeholders.province}
        </option>
        {chineseProvinces.map((province) => (
          <option key={province.key} value={province.label}>
            {province.label}
          </option>
        ))}
      </select>
    </div>
  );
}
