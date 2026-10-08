import { useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Battery,
  CircleHelp,
  Disc3,
  Gauge,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

const vehicleModels = {
  Toyota: ['Yaris', 'Vios', 'Corolla Altis', 'Camry', 'Hilux Revo', 'Fortuner'],
  Honda: ['City', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Jazz'],
  Isuzu: ['D-Max', 'MU-X'],
  Mitsubishi: ['Triton', 'Pajero Sport', 'Attrage', 'Mirage', 'Xpander'],
  Nissan: ['Almera', 'Navara', 'Kicks', 'Sylphy'],
  Mazda: ['Mazda 2', 'Mazda 3', 'CX-3', 'CX-5', 'BT-50'],
} as const;

type VehicleMake = keyof typeof vehicleModels;
type Symptom = 'brakes' | 'starting' | 'vibration' | 'suspension' | 'warning' | 'ac' | 'transmission' | 'cooling';
type Recommendation = {
  part: string;
  searchTerm: string;
  reason: string;
  priority: 'ควรตรวจ' | 'ควรตรวจเร็ว';
  icon: typeof Wrench;
};
type ScreeningResult = {
  summary: string;
  possibleCauses: {
    system: string;
    cause: string;
    reason: string;
    urgency: 'urgent' | 'soon' | 'monitor';
    parts: { name: string; searchTerm: string; reason: string }[];
  }[];
  inspections: string[];
  safetyAdvice: string;
};
type SymptomOption = { value: Symptom; label: string };

const passengerCarSymptoms: SymptomOption[] = [
  { value: 'brakes', label: 'เบรกมีเสียงหรือระยะเบรกยาว' },
  { value: 'starting', label: 'สตาร์ตช้าหรือแบตเตอรี่หมดไว' },
  { value: 'vibration', label: 'เครื่องสั่นหรือรอบเดินเบาไม่นิ่ง' },
  { value: 'transmission', label: 'เกียร์กระตุกหรือเปลี่ยนเกียร์ช้า' },
  { value: 'ac', label: 'แอร์ไม่เย็นหรือลมออกน้อย' },
  { value: 'warning', label: 'มีไฟเตือนบนหน้าปัด' },
];

const utilityVehicleSymptoms: SymptomOption[] = [
  { value: 'brakes', label: 'เบรกมีเสียงหรือระยะเบรกยาว' },
  { value: 'starting', label: 'สตาร์ตช้าหรือแบตเตอรี่หมดไว' },
  { value: 'suspension', label: 'มีเสียง/สั่นจากช่วงล่างหรือพวงมาลัย' },
  { value: 'transmission', label: 'เกียร์กระตุกหรือเข้าเกียร์ยาก' },
  { value: 'cooling', label: 'ความร้อนขึ้นหรือน้ำหล่อเย็นพร่อง' },
  { value: 'warning', label: 'มีไฟเตือนบนหน้าปัด' },
];

const utilityModels = new Set([
  'Hilux Revo', 'Fortuner', 'D-Max', 'MU-X', 'Triton', 'Pajero Sport',
  'Navara', 'BT-50', 'CR-V', 'HR-V', 'Kicks', 'CX-3', 'CX-5', 'Xpander',
]);

function getModelSymptoms(model: string): SymptomOption[] {
  return utilityModels.has(model) ? utilityVehicleSymptoms : passengerCarSymptoms;
}

function getScreeningResult(
  vehicle: { make: VehicleMake; model: string; year: number; mileage: number },
  symptoms: string[],
): ScreeningResult {
  const reported = symptoms.join(' ').toLowerCase();
  const possibleCauses: ScreeningResult['possibleCauses'] = [];
  const addCause = (
    system: string,
    cause: string,
    reason: string,
    urgency: 'urgent' | 'soon' | 'monitor',
    parts: ScreeningResult['possibleCauses'][number]['parts'],
  ) => possibleCauses.push({ system, cause, reason, urgency, parts });

  if (/เบรก|ผ้าเบรก|จานเบรก|เหยียบเบรก|เบรค|เอี๊ยด|ครืด/.test(reported)) {
    addCause(
      'ระบบเบรก',
      'ผ้าเบรกสึก จานเบรกมีรอย หรือมีฝุ่น/สิ่งแปลกปลอม',
      'ข้อความระบุอาการเกี่ยวกับเบรกหรือมีเสียงขณะเบรก ควรตรวจผ้าเบรก จานเบรก และคาลิเปอร์ก่อนเปลี่ยนอะไหล่',
      /เบรกไม่ค่อยอยู่|เบรกไม่อยู่|เบรกจม|เบรกแตก/.test(reported) ? 'urgent' : 'soon',
      [{ name: 'ผ้าเบรกและจานเบรก', searchTerm: 'เบรก', reason: 'ให้ช่างวัดความหนาและตรวจผิวจานเบรกก่อนเลือกอะไหล่' }],
    );
  }

  if (/สตาร์ต|แบต|ไดชาร์จ/.test(reported)) {
    addCause(
      'ระบบสตาร์ตและไฟฟ้า',
      'แบตเตอรี่อ่อน ขั้วแบตเตอรี่หลวม หรือระบบชาร์จมีปัญหา',
      'อาการสตาร์ตยากหรือแบตหมดอาจมาจากแบตเตอรี่ ไดชาร์จ หรือกระแสไฟรั่ว ควรวัดแรงดันและทดสอบระบบก่อนเปลี่ยนแบตเตอรี่',
      /ดับกลางทาง|ไฟหน้าดับ|ควัน.*แบต/.test(reported) ? 'urgent' : 'soon',
      [{ name: 'แบตเตอรี่และระบบชาร์จ', searchTerm: 'แบตเตอรี่', reason: 'ให้ช่างทดสอบแบตเตอรี่ ไดชาร์จ และขั้วสายไฟ' }],
    );
  }

  if (/เครื่องสั่น|เครื่องยนต์|เดินเบา|รอบตก|เครื่องสะดุด|เร่งไม่ขึ้น/.test(reported)) {
    addCause(
      'เครื่องยนต์และแท่นเครื่อง',
      'อาจเกี่ยวกับแท่นเครื่อง หัวเทียน/คอยล์ ระบบจ่ายเชื้อเพลิง หรือการทำงานของเครื่องยนต์',
      'อาการสั่นเกิดได้จากหลายระบบและยังยืนยันสาเหตุไม่ได้ ควรให้ช่างตรวจรอบเดินเบา รหัสขัดข้อง และจุดยึดเครื่องยนต์',
      /เครื่องดับ|ควันหนา|กลิ่นไหม้|ความร้อนขึ้น/.test(reported) ? 'urgent' : 'soon',
      [
        { name: 'แท่นเครื่อง', searchTerm: 'แท่นเครื่อง', reason: 'ตรวจยางแท่นเครื่องฉีก/ทรุด โดยเฉพาะเมื่อสั่นตอนออกตัวหรือเข้าเกียร์' },
        { name: 'หัวเทียนและคอยล์จุดระเบิด', searchTerm: 'หัวเทียน', reason: 'ตรวจเมื่อเครื่องสะดุด รอบเดินเบาไม่นิ่ง หรือมีไฟเตือนเครื่องยนต์' },
      ],
    );
  }

  if (/ช่วงล่าง|โช้ค|ลูกหมาก|เสียง.*ล้อ|ล้อ.*เสียง|ตกหลุม|พวงมาลัย|สั่น.*พวงมาลัย/.test(reported)) {
    addCause(
      'ช่วงล่างและพวงมาลัย',
      'อาจเกิดจากโช้คอัพ ลูกหมาก บูช ยาง หรือการตั้งศูนย์/ถ่วงล้อ',
      'เสียงหรือแรงสั่นจากล้อและช่วงล่างต้องตรวจหาตำแหน่งจริง เพราะหลายชิ้นส่วนมีอาการคล้ายกัน',
      /พวงมาลัยคุมไม่ได้|ล้อส่าย|ล้อหลวม/.test(reported) ? 'urgent' : 'soon',
      [{ name: 'โช้คอัพ ลูกหมาก และบูชช่วงล่าง', searchTerm: 'โช้คอัพ', reason: 'ให้ช่างตรวจระยะหลวม การรั่ว และสภาพยาง/ลูกหมากก่อนเปลี่ยน' }],
    );
  }

  if (/เกียร์|เข้าเกียร์|เปลี่ยนเกียร์|คลัตช์|คลัช|ลื่น|กระตุกตอนเปลี่ยน/.test(reported)) {
    addCause(
      'ระบบเกียร์และคลัตช์',
      'อาจเกี่ยวกับระดับ/สภาพน้ำมันเกียร์ คลัตช์ หรือชุดควบคุมเกียร์',
      'อาการเข้าเกียร์ยากหรือเกียร์กระตุกควรตรวจชนิดและระดับน้ำมันเกียร์ รวมถึงสแกนรหัสระบบก่อนสั่งอะไหล่',
      /เกียร์ไม่เข้า|รถไม่ขยับ|เกียร์หลุด/.test(reported) ? 'urgent' : 'soon',
      [{ name: 'น้ำมันเกียร์และระบบคลัตช์', searchTerm: 'น้ำมันเกียร์', reason: 'ตรวจตามคู่มือและสแกนระบบก่อนเลือกชนิดอะไหล่หรือน้ำมัน' }],
    );
  }

  if (/ไฟเตือน|ไฟโชว์|เช็กเอนจิน|check engine|abs|ถุงลม|รูปแบต/.test(reported)) {
    addCause(
      'ระบบไฟฟ้าและเซ็นเซอร์',
      'ต้องอ่านรหัสขัดข้องเพื่อระบุระบบที่แจ้งเตือน',
      'ไฟเตือนหนึ่งดวงอาจเกิดได้จากหลายสาเหตุ ไม่ควรซื้อเซ็นเซอร์หรืออะไหล่จากสัญลักษณ์เพียงอย่างเดียว',
      /ไฟแดง|ความร้อนขึ้น|น้ำมันเครื่อง.*ไฟ|ไฟเบรก/.test(reported) ? 'urgent' : 'soon',
      [{ name: 'การสแกนรหัสขัดข้องและตรวจเซ็นเซอร์', searchTerm: 'เซ็นเซอร์', reason: 'อ่านรหัส OBD-II และตรวจวงจรก่อนระบุชิ้นส่วนที่ต้องเปลี่ยน' }],
    );
  }

  if (/แอร์|ลมไม่เย็น/.test(reported)) {
    addCause(
      'ระบบปรับอากาศ',
      'อาจเกี่ยวกับกรองแอร์ น้ำยาแอร์ พัดลม หรือคอมเพรสเซอร์',
      'อาการแอร์ไม่เย็นมีหลายสาเหตุ ควรวัดแรงดันและตรวจหารอยรั่วก่อนเติมน้ำยาหรือเปลี่ยนอะไหล่',
      'soon',
      [{ name: 'กรองแอร์และระบบปรับอากาศ', searchTerm: 'กรองแอร์', reason: 'ให้ช่างตรวจกรอง พัดลม แรงดันน้ำยา และการรั่วก่อน' }],
    );
  }

  if (/ความร้อนขึ้น|น้ำหล่อเย็นพร่อง/.test(reported)) {
    addCause(
      'ระบบหล่อเย็นและของเหลว',
      'อาจมีการรั่วซึม ระดับของเหลวผิดปกติ หรือระบบระบายความร้อนทำงานไม่เต็มที่',
      'ตรวจระดับของเหลวและหารอยรั่วโดยช่าง ไม่ควรเปิดฝาหม้อน้ำขณะเครื่องร้อน',
      'urgent',
      [{ name: 'หม้อน้ำ ท่อยาง และระบบหล่อเย็น', searchTerm: 'หม้อน้ำ', reason: 'ให้ช่างตรวจการรั่ว พัดลม และระดับน้ำหล่อเย็นอย่างปลอดภัย' }],
    );
  }

  if (possibleCauses.length === 0 && symptoms.length > 0) {
    addCause(
      'ต้องตรวจเพิ่มเติม',
      'ข้อมูลที่กรอกยังไม่พอระบุระบบหรืออะไหล่ที่น่าจะเป็นสาเหตุ',
      `รับอาการ "${reported.slice(0, 180)}" แล้ว แต่ไม่ควรฟันธงอะไหล่จากอาการที่เลือกเพียงอย่างเดียว ควรให้ช่างทดลองตรวจ`,
      'soon',
      [{ name: 'การตรวจสภาพและสแกนระบบรถ', searchTerm: 'อะไหล่รถยนต์', reason: 'ระบุชิ้นส่วนจากการตรวจรถจริงก่อนซื้อ เพื่อเลี่ยงการเปลี่ยนผิดจุด' }],
    );
  }

  const vehicleAge = Math.max(0, new Date().getFullYear() - vehicle.year);
  const summary = possibleCauses.length > 0
    ? `สำหรับ ${vehicle.make} ${vehicle.model} ปี ${vehicle.year} เลขไมล์ ${vehicle.mileage.toLocaleString()} กม. พบข้อมูลอาการที่เกี่ยวข้องกับ ${possibleCauses.map((item) => item.system).join(' และ ')} (อายุรถประมาณ ${vehicleAge} ปี) รายการด้านล่างเป็นความเป็นไปได้จากข้อมูลที่แจ้ง ไม่ใช่การยืนยันว่าอะไหล่เสีย`
    : `สำหรับ ${vehicle.make} ${vehicle.model} ปี ${vehicle.year} เลขไมล์ ${vehicle.mileage.toLocaleString()} กม. ยังไม่พบอาการเฉพาะที่ระบุได้จากข้อมูลที่กรอก`;

  const inspections = possibleCauses.length > 0
    ? possibleCauses.map((item) => `ตรวจ${item.system}: ${item.cause}`)
    : ['ตรวจเช็กระยะและประวัติซ่อมตามคู่มือประจำรุ่น'];

  return {
    summary,
    possibleCauses,
    inspections,
    safetyAdvice: possibleCauses.some((item) => item.urgency === 'urgent')
      ? 'หากรถควบคุมยาก เบรกผิดปกติ มีควัน/กลิ่นไหม้ หรือความร้อนสูง ให้จอดในที่ปลอดภัย ดับเครื่องเมื่อเหมาะสม และติดต่อช่าง/รถยก อย่าฝืนขับ'
      : 'นี่เป็นการคัดกรองจากข้อความและข้อมูลรถ ไม่ใช่การวินิจฉัยจากการตรวจจริง อย่าเพิ่งสั่งเปลี่ยนอะไหล่จนกว่าช่างจะยืนยันสาเหตุ หากอาการรุนแรงให้หยุดขับและขอความช่วยเหลือ',
  };
}

function getRecommendations(mileage: number, age: number, symptoms: Symptom[]): Recommendation[] {
  const suggestions: Recommendation[] = [];

  if (mileage >= 10000) {
    suggestions.push({
      part: 'น้ำมันเครื่องและไส้กรอง',
      searchTerm: 'น้ำมันเครื่อง',
      reason: 'ควรตรวจประวัติการเปลี่ยนและเปลี่ยนตามระยะที่คู่มือรถกำหนด',
      priority: 'ควรตรวจ',
      icon: Gauge,
    });
  }
  if (mileage >= 20000) {
    suggestions.push({
      part: 'ไส้กรองอากาศและกรองแอร์',
      searchTerm: 'ไส้กรอง',
      reason: 'ตรวจสภาพการอุดตันและฝุ่นสะสม ซึ่งอาจกระทบการขับขี่และระบบปรับอากาศ',
      priority: 'ควรตรวจ',
      icon: Sparkles,
    });
  }
  if (mileage >= 30000 || symptoms.includes('brakes')) {
    suggestions.push({
      part: 'ผ้าเบรกและน้ำมันเบรก',
      searchTerm: 'เบรก',
      reason: symptoms.includes('brakes')
        ? 'มีอาการเกี่ยวกับเบรก ควรให้ช่างตรวจโดยเร็วและหลีกเลี่ยงการขับหากเบรกผิดปกติมาก'
        : 'ให้ช่างวัดความหนาผ้าเบรกและตรวจระบบเบรกก่อนพิจารณาเปลี่ยน',
      priority: symptoms.includes('brakes') ? 'ควรตรวจเร็ว' : 'ควรตรวจ',
      icon: Disc3,
    });
  }
  if (mileage >= 40000) {
    suggestions.push({
      part: 'ยางรถยนต์',
      searchTerm: 'ยางรถยนต์',
      reason: 'ตรวจดอกยาง รอยแตกร้าว และวันผลิต การเปลี่ยนขึ้นกับสภาพจริงไม่ใช่เลขไมล์อย่างเดียว',
      priority: 'ควรตรวจ',
      icon: Disc3,
    });
    suggestions.push({
      part: 'น้ำมันเกียร์',
      searchTerm: 'น้ำมันเกียร์',
      reason: 'ตรวจประวัติการบำรุงรักษาและชนิดน้ำมันเกียร์ตามคู่มือประจำรุ่น',
      priority: 'ควรตรวจ',
      icon: Wrench,
    });
  }
  if (mileage >= 60000) {
    suggestions.push({
      part: 'หัวเทียน',
      searchTerm: 'หัวเทียน',
      reason: 'ตรวจตามชนิดหัวเทียนและระยะเปลี่ยนที่ผู้ผลิตรถกำหนด',
      priority: 'ควรตรวจ',
      icon: Sparkles,
    });
  }
  if (mileage >= 80000 || symptoms.includes('vibration') || symptoms.includes('suspension')) {
    suggestions.push({
      part: 'โช้คอัพและชิ้นส่วนช่วงล่าง',
      searchTerm: 'โช้คอัพ',
      reason: symptoms.includes('vibration')
        ? 'มีอาการสั่นหรือเสียง ควรตรวจช่วงล่างและตั้งศูนย์ล้อ'
        : 'ให้ช่างตรวจการรั่วและการสึกหรอของช่วงล่าง',
      priority: symptoms.includes('vibration') || symptoms.includes('suspension') ? 'ควรตรวจเร็ว' : 'ควรตรวจ',
      icon: Wrench,
    });
  }
  if (age >= 3 || symptoms.includes('starting')) {
    suggestions.push({
      part: 'แบตเตอรี่รถยนต์',
      searchTerm: 'แบตเตอรี่',
      reason: symptoms.includes('starting')
        ? 'รถสตาร์ตยากควรทดสอบแบตเตอรี่และระบบชาร์จ'
        : 'อายุรถถึงช่วงที่ควรทดสอบกำลังแบตเตอรี่ตามสภาพการใช้งาน',
      priority: symptoms.includes('starting') ? 'ควรตรวจเร็ว' : 'ควรตรวจ',
      icon: Battery,
    });
  }
  if (symptoms.includes('warning')) {
    suggestions.push({
      part: 'อุปกรณ์ตรวจเช็กระบบและเซ็นเซอร์',
      searchTerm: 'เซ็นเซอร์',
      reason: 'ควรอ่านรหัสข้อผิดพลาดด้วยเครื่องสแกนก่อนสั่งซื้ออะไหล่ เพื่อหาสาเหตุให้ตรงจุด',
      priority: 'ควรตรวจเร็ว',
      icon: AlertTriangle,
    });
  }

  return suggestions;
}

type VehicleCheckupProps = {
  onSearchParts: (query: string, vehicle: { make: string; model: string }) => void;
};

export default function VehicleCheckup({ onSearchParts }: VehicleCheckupProps) {
  const currentYear = new Date().getFullYear();
  const [make, setMake] = useState<VehicleMake | ''>('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const symptomOptions = model ? getModelSymptoms(model) : [];
  const [checkedVehicle, setCheckedVehicle] = useState<{
    make: VehicleMake;
    model: string;
    year: number;
    mileage: number;
    symptoms: Symptom[];
  } | null>(null);

  const recommendations = checkedVehicle
    ? getRecommendations(
        checkedVehicle.mileage,
        currentYear - checkedVehicle.year,
        checkedVehicle.symptoms,
      )
    : [];

  const toggleSymptom = (symptom: Symptom) => {
    setSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom],
    );
    setCheckedVehicle(null);
    setScreeningResult(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!make || !model || !year || mileage === '' || symptoms.length === 0) return;
    const vehicle = {
      make,
      model,
      year: Number(year),
      mileage: Number(mileage),
      symptoms,
    };
    setCheckedVehicle(vehicle);
    const selectedSymptoms = symptoms.map(
      (symptom) => symptomOptions.find((option) => option.value === symptom)?.label ?? symptom,
    );
    setScreeningResult(getScreeningResult(vehicle, selectedSymptoms));
  };

  return (
    <section id="vehicle-check" className="scroll-mt-24 bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            <span className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
              ผู้ช่วยดูแลรถ MACHAPARTS
            </span>
          </div>
          <h2 className="mb-3 text-3xl font-bold text-white lg:text-4xl">
            เช็กระยะและอะไหล่ที่ควรตรวจ
          </h2>
          <p className="text-slate-400">
            เลือกรุ่นรถและอาการที่สงสัย เพื่อดูจุดที่ควรตรวจและอะไหล่ที่เกี่ยวข้องเบื้องต้น
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8"
          >
            <h3 className="mb-6 text-lg font-semibold text-white">ข้อมูลรถของคุณ</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-300">
                ยี่ห้อรถ
                <select
                  required
                  value={make}
                  onChange={(event) => {
                    setMake(event.target.value as VehicleMake | '');
                    setModel('');
                    setSymptoms([]);
                    setCheckedVehicle(null);
                    setScreeningResult(null);
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="">เลือกยี่ห้อ</option>
                  {Object.keys(vehicleModels).map((vehicleMake) => (
                    <option key={vehicleMake} value={vehicleMake}>{vehicleMake}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-300">
                รุ่นรถ
                <select
                  required
                  value={model}
                  onChange={(event) => {
                    setModel(event.target.value);
                    setSymptoms([]);
                    setCheckedVehicle(null);
                    setScreeningResult(null);
                  }}
                  disabled={!make}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">เลือกรุ่นรถ</option>
                  {make && vehicleModels[make].map((vehicleModel) => (
                    <option key={vehicleModel} value={vehicleModel}>{vehicleModel}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-300">
                ปีรถ
                <select
                  required
                  value={year}
                  onChange={(event) => {
                    setYear(event.target.value);
                    setCheckedVehicle(null);
                    setScreeningResult(null);
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-cyan-400"
                >
                  <option value="">เลือกปี</option>
                  {Array.from({ length: currentYear - 1989 }, (_, index) => currentYear - index).map((carYear) => (
                    <option key={carYear} value={carYear}>{carYear}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-300">
                เลขไมล์ปัจจุบัน (กม.)
                <input
                  required
                  type="number"
                  min="0"
                  max="1000000"
                  step="1"
                  inputMode="numeric"
                  value={mileage}
                  onChange={(event) => {
                    setMileage(event.target.value);
                    setCheckedVehicle(null);
                    setScreeningResult(null);
                  }}
                  placeholder="เช่น 45000"
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-medium text-slate-300">
                เลือกอาการที่พบหรือสงสัย
                <span className="ml-1 font-normal text-slate-500">
                  {model ? `(รายการตรวจเบื้องต้นสำหรับ ${make} ${model} · เลือกได้หลายข้อ)` : '(เลือกรุ่นรถเพื่อดูตัวเลือก)'}
                </span>
              </legend>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                รายการปรับตามประเภทรถที่เลือก ใช้เป็นจุดสังเกตเบื้องต้น ไม่ได้หมายความว่ารุ่นนี้มีปัญหาดังกล่าวแน่นอน
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {symptomOptions.map((symptom) => (
                  <label
                    key={symptom.value}
                    className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300 transition-colors hover:border-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={symptoms.includes(symptom.value)}
                      onChange={() => toggleSymptom(symptom.value)}
                      className="mt-0.5 accent-cyan-400"
                    />
                    {symptom.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={!model || symptoms.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 font-semibold text-white transition hover:from-blue-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              วิเคราะห์อาการและอะไหล่ที่ควรตรวจ
            </button>
          </form>

          <div
            aria-live="polite"
            className="rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8"
          >
            {checkedVehicle ? (
              <>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-sm text-slate-400">ผลแนะนำเบื้องต้นสำหรับ</p>
                    <h3 className="text-xl font-bold text-white">
                      {checkedVehicle.make} {checkedVehicle.model} ปี {checkedVehicle.year}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      เลขไมล์ {checkedVehicle.mileage.toLocaleString()} กม.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    คัดกรองตามรุ่นรถและอาการ
                  </span>
                </div>

                {screeningResult && (
                  <div className="mb-6 space-y-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                      <h4 className="mb-2 text-sm font-semibold text-slate-200">ข้อมูลที่ใช้ประเมิน</h4>
                      <p className="text-sm text-slate-400">
                        {checkedVehicle.make} {checkedVehicle.model} · ปี {checkedVehicle.year} ·
                        {' '}{checkedVehicle.mileage.toLocaleString()} กม.
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        อาการที่เลือก: {checkedVehicle.symptoms.length > 0
                          ? checkedVehicle.symptoms.map(
                              (symptom) => getModelSymptoms(checkedVehicle.model).find((option) => option.value === symptom)?.label ?? symptom,
                            ).join(', ')
                          : 'ไม่ได้เลือก'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                      <h4 className="mb-2 flex items-center gap-2 font-semibold text-cyan-100">
                        <Wrench className="h-4 w-4" />
                        ผลคัดกรองอาการเบื้องต้น
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-200">{screeningResult.summary}</p>
                    </div>

                    {screeningResult.possibleCauses.map((item, index) => (
                      <div
                        key={`${item.system}-${index}`}
                        className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                            {item.system}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            item.urgency === 'urgent'
                              ? 'bg-rose-400/10 text-rose-200'
                              : item.urgency === 'soon'
                                ? 'bg-amber-400/10 text-amber-200'
                                : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.urgency === 'urgent' ? 'ควรตรวจด่วน' : item.urgency === 'soon' ? 'ควรนัดตรวจ' : 'ติดตามอาการ'}
                          </span>
                        </div>
                        <h5 className="font-semibold text-white">{item.cause}</h5>
                        <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.reason}</p>
                        {item.parts.map((part) => (
                          <div key={`${item.system}-${part.name}`} className="mt-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                            <p className="text-sm font-medium text-slate-200">
                              ควรให้ช่างตรวจ: {part.name}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-400">{part.reason}</p>
                            <button
                              type="button"
                              onClick={() => {
                                onSearchParts(part.searchTerm, {
                                  make: checkedVehicle.make,
                                  model: checkedVehicle.model,
                                });
                                document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                            >
                              ค้นหาอะไหล่ประเภทนี้
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}

                    {screeningResult.inspections.length > 0 && (
                      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                        <h5 className="mb-2 font-semibold text-white">จุดที่ควรให้ช่างตรวจ</h5>
                        <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
                          {screeningResult.inspections.map((inspection, index) => (
                            <li key={`${index}-${inspection}`}>{inspection}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-100">
                        <AlertTriangle className="h-4 w-4" />
                        ความปลอดภัย
                      </p>
                      <p className="text-sm leading-relaxed text-slate-300">{screeningResult.safetyAdvice}</p>
                    </div>
                  </div>
                )}

                <h4 className="mb-3 font-semibold text-slate-200">รายการตรวจเช็กตามเลขไมล์เบื้องต้น</h4>
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {recommendations.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.part}
                          className="flex gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                        >
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            item.priority === 'ควรตรวจเร็ว'
                              ? 'bg-amber-400/10 text-amber-300'
                              : 'bg-cyan-400/10 text-cyan-300'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <h4 className="font-semibold text-white">{item.part}</h4>
                              <span className={`rounded-full px-2 py-0.5 text-xs ${
                                item.priority === 'ควรตรวจเร็ว'
                                  ? 'bg-amber-400/10 text-amber-200'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {item.priority}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-400">{item.reason}</p>
                            <button
                              type="button"
                              onClick={() => {
                                onSearchParts(item.searchTerm, {
                                  make: checkedVehicle.make,
                                  model: checkedVehicle.model,
                                });
                                document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
                            >
                              ดูอะไหล่ที่เกี่ยวข้อง
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-center">
                    <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
                    <p className="font-semibold text-white">ยังไม่มีรายการที่เข้าเกณฑ์จากข้อมูลนี้</p>
                    <p className="mt-1 text-sm text-slate-400">
                      ตรวจเช็กตามคู่มือรถและประวัติการบำรุงรักษาอย่างสม่ำเสมอ
                    </p>
                  </div>
                )}
                <p className="mt-5 flex gap-2 text-xs leading-relaxed text-slate-500">
                  <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
                  รายการนี้เป็นแนวทางคัดกรองจากเลขไมล์ อายุรถ และอาการที่แจ้ง ไม่ใช่การวินิจฉัยหรือยืนยันว่าต้องเปลี่ยนอะไหล่ ควรให้ช่างตรวจสภาพจริงและอ้างอิงคู่มือประจำรุ่นก่อนซื้อ
                </p>
              </>
            ) : (
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <Wrench className="h-8 w-8 text-cyan-300" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">รู้ก่อน เปลี่ยนเท่าที่จำเป็น</h3>
                <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                  กรอกข้อมูลรถและอาการที่พบ ระบบจะแสดงรายการอะไหล่ที่ควรให้ช่างตรวจตามระยะเบื้องต้น
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                  <AlertTriangle className="h-4 w-4" />
                  ไม่ต้องเดาหรือเปลี่ยนอะไหล่โดยยังไม่ตรวจสภาพจริง
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}