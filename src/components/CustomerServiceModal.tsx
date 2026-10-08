import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

export type CustomerServiceTopic =
  | 'tracking'
  | 'returns'
  | 'faq'
  | 'mechanic'
  | 'warranty';

type CustomerServiceModalProps = {
  topic: CustomerServiceTopic;
  onClose: () => void;
};

const topicTitles: Record<CustomerServiceTopic, string> = {
  tracking: 'ติดตามพัสดุ',
  returns: 'นโยบายคืนสินค้า',
  faq: 'คำถามที่พบบ่อย',
  mechanic: 'ติดต่อช่าง',
  warranty: 'รับประกันสินค้า',
};

const fieldClassName =
  'w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400';

function ServiceNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-relaxed text-amber-100">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export default function CustomerServiceModal({ topic, onClose }: CustomerServiceModalProps) {
  const [trackingCode, setTrackingCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTrackingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedCode(trackingCode.trim());
    setSubmitted(true);
  };

  const handleRequestSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        aria-labelledby="customer-service-title"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <h2 id="customer-service-title" className="text-lg font-bold text-white">
            {topicTitles[topic]}
          </h2>
          <button
            aria-label="ปิดหน้าต่าง"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 p-6">
          {topic === 'tracking' && (
            <>
              <p className="text-sm leading-relaxed text-slate-300">
                กรอกเลขพัสดุที่ได้รับจากร้านเพื่อเตรียมตรวจสอบสถานะ
              </p>
              <form className="space-y-3" onSubmit={handleTrackingSubmit}>
                <label className="block text-sm font-medium text-slate-300" htmlFor="tracking-code">
                  เลขพัสดุหรือเลขคำสั่งซื้อ
                </label>
                <input
                  autoComplete="off"
                  className={fieldClassName}
                  id="tracking-code"
                  onChange={(event) => {
                    setTrackingCode(event.target.value);
                    setSubmitted(false);
                  }}
                  placeholder="กรอกเลขพัสดุ"
                  required
                  value={trackingCode}
                />
                <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400" type="submit">
                  ตรวจสอบพัสดุ
                </button>
              </form>
              {submitted && (
                <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-sm text-slate-300">
                  เลขที่กรอก: <span className="font-semibold text-white">{submittedCode}</span>
                  <p className="mt-2">เว็บไซต์ยังไม่ได้เชื่อมต่อกับบริษัทขนส่ง จึงยังดึงสถานะพัสดุจริงไม่ได้</p>
                </div>
              )}
            </>
          )}

          {topic === 'returns' && (
            <>
              <ServiceNotice>
                เงื่อนไขและระยะเวลาคืนสินค้าทางการยังไม่ได้ระบุ กรุณาตรวจสอบกับร้านก่อนส่งสินค้ากลับ
              </ServiceNotice>
              <RequestForm
                includeOrder
                onSubmit={handleRequestSubmit}
                submitted={submitted}
                submitLabel="เตรียมคำขอคืนสินค้า"
              />
            </>
          )}

          {topic === 'faq' && (
            <div className="space-y-3">
              <details className="group rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <summary className="cursor-pointer font-medium text-white">จะตรวจสอบได้อย่างไรว่าอะไหล่ตรงกับรถ?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  ตรวจสอบรุ่นย่อย ปีรถ และรหัสอะไหล่เทียบกับข้อมูลบนหน้าสินค้า หากไม่แน่ใจควรให้ช่างตรวจสอบก่อนสั่งซื้อ
                </p>
              </details>
              <details className="group rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <summary className="cursor-pointer font-medium text-white">ติดตามพัสดุจากหน้าเว็บได้ไหม?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  หน้าติดตามพัสดุยังไม่เชื่อมต่อกับบริษัทขนส่ง จึงยังแสดงสถานะการจัดส่งจริงไม่ได้
                </p>
              </details>
              <details className="group rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <summary className="cursor-pointer font-medium text-white">สินค้าเปลี่ยนหรือคืนได้ภายในกี่วัน?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  เงื่อนไขการคืนสินค้ายังไม่ได้ระบุบนเว็บไซต์ กรุณาติดต่อร้านเพื่อยืนยันก่อนดำเนินการ
                </p>
              </details>
              <details className="group rounded-xl border border-slate-800 bg-slate-800/50 p-4">
                <summary className="cursor-pointer font-medium text-white">สินค้าแต่ละชิ้นรับประกันนานเท่าไร?</summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  ระยะเวลารับประกันขึ้นอยู่กับสินค้าและเงื่อนไขผู้ผลิต โปรดตรวจสอบรายละเอียดในหน้าสินค้าก่อนซื้อ
                </p>
              </details>
            </div>
          )}

          {topic === 'mechanic' && (
            <>
              <p className="text-sm leading-relaxed text-slate-300">
                ฝากรายละเอียดรถและอาการที่พบ เพื่อเตรียมข้อมูลสำหรับติดต่อช่าง
              </p>
              <RequestForm
                includeVehicle
                onSubmit={handleRequestSubmit}
                submitted={submitted}
                submitLabel="เตรียมข้อความติดต่อช่าง"
              />
            </>
          )}

          {topic === 'warranty' && (
            <>
              <p className="text-sm leading-relaxed text-slate-300">
                เตรียมข้อมูลสินค้าและคำสั่งซื้อเพื่อสอบถามเรื่องการรับประกัน
              </p>
              <RequestForm
                includeOrder
                onSubmit={handleRequestSubmit}
                submitted={submitted}
                submitLabel="เตรียมคำขอรับประกัน"
              />
            </>
          )}

          <ServiceNotice>
            แบบฟอร์มนี้ทำงานในหน้าเว็บเท่านั้น ข้อมูลไม่ได้ถูกส่งหรือบันทึกไว้ เนื่องจากยังไม่มีระบบหลังบ้านหรือช่องทางติดต่อที่เชื่อมต่อ
          </ServiceNotice>
        </div>
      </section>
    </div>
  );
}

function RequestForm({
  includeOrder = false,
  includeVehicle = false,
  onSubmit,
  submitted,
  submitLabel,
}: {
  includeOrder?: boolean;
  includeVehicle?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitted: boolean;
  submitLabel: string;
}) {
  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      {includeOrder && (
        <input
          className={fieldClassName}
          name="orderNumber"
          placeholder="เลขคำสั่งซื้อ"
          required
        />
      )}
      <input className={fieldClassName} name="name" placeholder="ชื่อผู้ติดต่อ" required />
      <input
        className={fieldClassName}
        name="phone"
        placeholder="เบอร์โทรศัพท์"
        required
        type="tel"
      />
      {includeVehicle && (
        <input
          className={fieldClassName}
          name="vehicle"
          placeholder="ยี่ห้อ รุ่น และปีรถ"
          required
        />
      )}
      <textarea
        className={`${fieldClassName} resize-y`}
        name="details"
        placeholder={includeVehicle ? 'รายละเอียดอาการหรือสิ่งที่ต้องการสอบถาม' : 'รายละเอียดสินค้าและปัญหาที่พบ'}
        required
        rows={3}
      />
      <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400" type="submit">
        {submitLabel}
      </button>
      {submitted && (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-sm leading-relaxed text-amber-100">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          ตรวจสอบข้อมูลแล้ว แต่ยังไม่ได้ส่งคำขอจริง กรุณาติดต่อร้านโดยตรงเมื่อมีช่องทางยืนยัน
        </p>
      )}
    </form>
  );
}
