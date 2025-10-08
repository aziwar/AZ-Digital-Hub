import {
  CodeBracketIcon,
  PresentationChartBarIcon,
  MegaphoneIcon,
  ChartBarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import React from 'react';

export interface ServiceIconProps {
  name: string;
  className?: string;
}

const iconMap = {
  'web-development': CodeBracketIcon,
  'digital-marketing': MegaphoneIcon,
  'analytics': ChartBarIcon,
  'seo': GlobeAltIcon,
  'mobile-apps': DevicePhoneMobileIcon,
  'consulting': PresentationChartBarIcon,
} as const;

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = "w-6 h-6" }) => {
  const IconComponent = iconMap[name as keyof typeof iconMap];
  
  if (!IconComponent) {
    return <CodeBracketIcon className={className} width={32} height={32} />;
  }
  
  return <IconComponent className={className} width={32} height={32} />;
};

// ServiceIconGrid Component - Previously Missing Export
export const ServiceIconGrid: React.FC = () => {
  const t = useTranslations('ServiceIcons');

  const services = [
    { name: 'web-development', key: 'webDevelopment', color: 'text-purple-400' },
    { name: 'digital-marketing', key: 'digitalMarketing', color: 'text-cyan-400' },
    { name: 'analytics', key: 'analytics', color: 'text-green-400' },
    { name: 'seo', key: 'seoOptimization', color: 'text-blue-400' },
    { name: 'mobile-apps', key: 'mobileApps', color: 'text-yellow-400' },
    { name: 'consulting', key: 'itConsulting', color: 'text-pink-400' },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {services.map((service) => (
        <div
          key={service.name}
          className="group flex flex-col items-center p-3 bg-slate-800/30 backdrop-blur rounded-lg border border-gray-600/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
        >
          <ServiceIcon
            name={service.name}
            className={`w-8 h-8 ${service.color} group-hover:scale-110 transition-transform duration-300`}
          />
          <span className="text-xs text-gray-400 mt-2 text-center group-hover:text-white transition-colors">
            {t(service.key)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ServiceIcon;