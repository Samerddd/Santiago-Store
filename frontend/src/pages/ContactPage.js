import { C, Btn, Input, Card } from '../components/UI';

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '60px 20px' }} dir="rtl">
      <h1 style={{ color: C.text, fontWeight: '900', fontSize: '36px', marginBottom: '8px' }}>اتصل بنا</h1>
      <p style={{ color: C.textSub, marginBottom: '48px', fontSize: '15px' }}>نحن هنا لمساعدتك في أي وقت</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <Card style={{ padding: '32px' }}>
          <h2 style={{ color: C.text, fontWeight: '700', marginBottom: '22px' }}>ارسل رسالة</h2>
          <Input label="الاسم" value="" onChange={() => {}} placeholder="اسمك الكامل" />
          <Input label="البريد الالكتروني" value="" onChange={() => {}} type="email" placeholder="example@email.com" />
          <Input label="الرسالة" value="" onChange={() => {}} rows={4} placeholder="كيف يمكننا مساعدتك؟" />
          <Btn fullWidth>ارسال</Btn>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[['الهاتف', '+972 50 000 0000'], ['البريد الالكتروني', 'info@santiago-sports.com'], ['العنوان', 'يافا، فلسطين'], ['اوقات العمل', 'السبت - الخميس | 9 - 21']].map(([l, v]) => (
            <Card key={l} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: C.textSub, fontSize: '12px', fontWeight: '600' }}>{l}</span>
              <span style={{ color: C.text, fontSize: '14px', fontWeight: '600' }}>{v}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

const C = { orange: '#ff6b00', text: '#fff', textSub: '#a0a0a0' };
