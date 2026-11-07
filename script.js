const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

/* ===== نموذج الطلب: تجهيز رسالة واتساب + إرفاق الموقع الجغرافي ===== */
const WHATSAPP_NUMBER = '966505386096';
let locationUrl = '';

const geoBtn = document.getElementById('geoBtn');
const geoStatus = document.getElementById('geoStatus');

if (geoBtn) {
  geoBtn.addEventListener('click', () => {
    if (!('geolocation' in navigator)) {
      geoStatus.textContent = 'المتصفح لا يدعم تحديد الموقع — اكتب الحي يدويًا في حقل المنطقة.';
      return;
    }
    geoBtn.disabled = true;
    geoStatus.textContent = 'جارٍ تحديد موقعك...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        locationUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        geoBtn.textContent = '✓ تم إرفاق الموقع';
        geoBtn.classList.add('attached');
        geoBtn.disabled = false;
        geoStatus.textContent = 'سيُرسل رابط موقع مشروعك داخل رسالة الطلب.';
      },
      () => {
        geoBtn.disabled = false;
        geoStatus.textContent = 'تعذّر تحديد الموقع — فعّل إذن الموقع أو اكتب الحي يدويًا.';
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
}

const orderForm = document.getElementById('orderForm');
const formError = document.getElementById('formError');

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const service = document.getElementById('fService').value;
    const area = document.getElementById('fArea').value.trim();
    const details = document.getElementById('fDetails').value.trim();

    const missing = [];
    if (!name) missing.push('الاسم');
    if (!phone) missing.push('رقم الجوال');
    if (!service) missing.push('نوع الخدمة');
    if (!area) missing.push('الحي/المنطقة');
    if (missing.length) {
      formError.textContent = 'يرجى تعبئة الحقول المطلوبة: ' + missing.join('، ');
      formError.hidden = false;
      formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    formError.hidden = true;

    const lines = [
      'طلب جديد — مؤسسة اضواء المصيف',
      '--------------------------',
      `الاسم: ${name}`,
      `رقم الجوال: ${phone}`,
      `نوع الخدمة: ${service}`,
      `الحي/المنطقة: ${area}`,
    ];
    if (details) lines.push(`تفاصيل الطلب: ${details}`);
    if (locationUrl) lines.push(`موقع المشروع: ${locationUrl}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
}
