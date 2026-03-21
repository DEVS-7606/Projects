import type { ReactNode } from 'react';
import { Card, CardContent } from '@/shared/components/atoms/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor?: string;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  subtitle,
}: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
