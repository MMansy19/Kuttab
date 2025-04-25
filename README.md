# 📖 كُتّاب | Kottab

**كُتّاب | Kottab** هو منصة تعليمية إسلامية تتيح للمستخدمين حجز جلسات مع معلمين مستقلين لتعلم القرآن الكريم. يوفّر الموقع طريقة بسيطة للتواصل مع المعلم مباشرةً دون وسطاء أو مدفوعات عبر أدوات مثل Zoom أو WhatsApp.

---

## 🎯 أهداف المنصة

- ✅ تمكين المعلمين المستقلين من الوصول لطلاب محتاجين لتعلم القرآن.  
- ✅ تمكين المسلمين من تعلم القرآن بسهولة وفي أي وقت.  
- ✅ إنشاء مجتمع تدريسي راقٍ، بلا تعقيد أو وساطة.  

---

## 🌍 About the Platform (English)

**Kottab** is an Islamic educational web platform that connects users with independent Quran teachers. Teachers can showcase their experience, set teaching hours, and specify contact methods such as Zoom or WhatsApp. Users can view, book, and contact them directly. No payments or intermediaries are involved.

---

## 🛠️ Features

- 🕌 Arabic-first UI with full RTL layout  
- 👨‍🏫 Teacher discovery and profiles  
- 📅 Availability calendar for booking sessions  
- 💡 Responsive layout with **dark/light mode** toggle  
- 🧪 Frontend-only with static JSON data  
- ⚙️ Built with **Next.js App Router**, **Tailwind CSS**, and **TypeScript**  

---

## 📁 Project Structure

```
app/
├── layout.tsx                # Global layout with dark/light theme
├── page.tsx                  # Homepage
├── teachers/                 # Teacher list and profiles
├── book/                     # Booking pages
├── auth/                     # Login/Signup pages
└── dashboard/                # User/Teacher dashboards

components/
├── Navbar.tsx
├── Footer.tsx
├── ThemeSwitcher.tsx
├── TeacherCard.tsx
└── BookingForm.tsx

data/
├── teachers.json
├── availability.json
└── bookings.json

types/
├── teacher.d.ts
├── user.d.ts
└── booking.d.ts
```

---

## 🧱 Technologies Used

- [Next.js 13+ (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [RTL Support with Arabic UI](https://rtlcss.com/)

---

## 🌓 Theme Support

- 🌙 Default theme: **Dark Mode**  
- 🌞 Toggle to **Light Mode** with a built-in switch  
- 💅 Fully styled using Tailwind's `dark:` utility classes for consistency  

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🙏 Contribution

Contributions are welcome! If you can help improve the design, translate content, or enhance accessibility and Islamic UI elements — feel free to open a pull request.

---

> **كُتّاب | Kottab** — منصة تعليمية تسعى لنشر القرآن الكريم بأسلوب بسيط، مباشر، وراقي