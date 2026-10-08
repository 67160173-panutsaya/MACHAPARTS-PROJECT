import { Search, ArrowRight, Shield, Truck, BadgeCheck, Wrench } from 'lucide-react';

type HeroProps = {
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

export default function Hero({ searchQuery, onSearchChange }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/4756887/pexels-photo-4756887.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Modern car repair shop"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-semibold tracking-wide uppercase">
              อะไหล่แท้รับประกัน ส่งฟรีทั่วประเทศ
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            ซื้ออะไหล่รถ
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              ออนไลน์ง่าย ๆ
            </span>
            <br />
            ราคายุติธรรม
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
            ค้นหาอะไหล่แท้จากแบรนด์ชั้นนำ เปรียบเทียบราคาได้ทันที 
            พร้อมข้อมูลความเข้ากันของรถทุกรุ่น ส่งฟรีทั่วประเทศ
          </p>

          {/* Big search */}
          <div className="relative mb-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ลองค้นหา 'ผ้าเบรก' หรือ 'น้ำมันเครื่อง'..."
              className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-700 focus:border-blue-500 text-white placeholder-slate-500 text-base rounded-2xl pl-12 pr-32 py-4 outline-none transition-colors shadow-xl"
            />
            <a
              href="#featured"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
            >
              ค้นหา
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <a
            href="#vehicle-check"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
          >
            <Wrench className="h-4 w-4 text-cyan-300" />
            เช็กสภาพรถและอะไหล่ที่ควรเปลี่ยน
            <ArrowRight className="h-3.5 w-3.5" />
          </a>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl">
            {[
              { icon: BadgeCheck, label: 'ของแท้ 100%' },
              { icon: Truck, label: 'ส่งฟรีทั่วประเทศ' },
              { icon: Shield, label: 'รับประกันคืนเงิน' },
              { icon: Wrench, label: 'แนะนำช่างติดตั้ง' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-slate-300 text-sm">
                <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-800 max-w-4xl">
          {[
            { value: '10,000+', label: 'รายการสินค้า' },
            { value: '50+', label: 'แบรนด์ชั้นนำ' },
            { value: '100,000+', label: 'ลูกค้าไว้วางใจ' },
            { value: '4.9/5', label: 'คะแนนรีวิว' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900/60 px-6 py-5 text-center">
              <p className="text-xl font-bold text-white mb-0.5">{stat.value}</p>
              <p className="text-slate-400 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
