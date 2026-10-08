import { Disc, Droplet, Cog, Zap, Car, Wrench } from 'lucide-react';

export type Category = {
  id: string;
  label: string;
  icon: typeof Disc;
};

export const categories: Category[] = [
  { id: 'all', label: 'ทั้งหมด', icon: Wrench },
  { id: 'ระบบเบรก', label: 'ระบบเบรก', icon: Disc },
  { id: 'เครื่องยนต์', label: 'เครื่องยนต์', icon: Cog },
  { id: 'ของเหลวและสารหล่อลื่น', label: 'น้ำมันและของเหลว', icon: Droplet },
  { id: 'ระบบไฟฟ้า', label: 'ระบบไฟฟ้า', icon: Zap },
  { id: 'ภายนอกรถ', label: 'ภายนอกรถ', icon: Car },
  { id: 'อุปกรณ์ฉุกเฉิน', label: 'อุปกรณ์ฉุกเฉิน', icon: Wrench },
];

type CategoryBarProps = {
  active: string;
  onChange: (id: string) => void;
};

export default function CategoryBar({ active, onChange }: CategoryBarProps) {
  return (
    <section id="categories" className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
