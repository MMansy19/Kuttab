# 📖 كُتّاب (Kottab) - Islamic Educational Platform

**كُتّاب** is an Islamic educational platform that connects students with independent Quran teachers. The platform provides a simple way for users to discover teachers, view their availability, and book sessions directly without intermediaries or payment processing.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue)](http://localhost:3000)

<p align="center">
  <img src="public/images/islamic-pattern.png" alt="Kottab Platform" width="600px" />
</p>

## 🌍 About Kottab

### بالعربية
**كُتّاب** هو منصة تعليمية إسلامية تتيح للمستخدمين حجز جلسات مع معلمين مستقلين لتعلم القرآن الكريم. يوفّر الموقع طريقة بسيطة للتواصل مع المعلم مباشرةً دون وسطاء أو مدفوعات عبر أدوات مثل Zoom أو WhatsApp.

### In English
**Kottab** is an Islamic educational web platform that connects users with independent Quran teachers. Teachers can showcase their experience, set teaching hours, and specify contact methods such as Zoom or WhatsApp. Users can view, book, and contact them directly. No payments or intermediaries are involved.

## 🎯 Platform Goals

- ✅ Enable independent teachers to reach students who need Quranic education
- ✅ Make Quran learning accessible to Muslims anywhere, anytime
- ✅ Create a refined teaching community without complexity or intermediation

## 🛠️ Key Features

- 🕌 **Arabic-first UI** with full RTL layout support
- 👨‍🏫 **Teacher discovery** with detailed profile pages
- 📅 **Availability calendar** for easy session booking
- 🔒 **Role-based authentication** for users, teachers, and administrators
- 📱 **Responsive design** that works on mobile and desktop
- ⚡ **Performance optimized** with fast loading times and modern image formats

## 🚀 Performance Optimization

The platform is built with performance in mind:

- **Image Optimization**: All images are converted to WebP/AVIF formats and properly sized
- **Responsive Images**: Multiple image sizes are generated for different devices
- **Lazy Loading**: Images are loaded only when they enter the viewport
- **Core Web Vitals**: Optimized for excellent Lighthouse scores

See our [Image Optimization Guide](docs/IMAGE-OPTIMIZATION.md) for details.
- ⚡ **Optimized performance** with code splitting and image optimization
- 🌓 **Dark/light mode toggle** for comfortable viewing
- 📊 **Admin dashboard** for platform management
- 🔗 **Direct communication** between students and teachers

## 💻 Tech Stack

- **Frontend**: 
  - [Next.js 13+ (App Router)](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/) with RTL support
  - [TypeScript](https://www.typescriptlang.org/)
  
- **Backend**:
  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [Prisma ORM](https://www.prisma.io/) for database access
  - [NextAuth.js](https://next-auth.js.org/) for authentication

- **Database**:
  - PostgreSQL (production)
  - SQLite (development)

- **Deployment**:
  - [Vercel](https://vercel.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kottab.git
cd kottab
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_FRONTEND_ONLY=true
DATABASE_URL="frontend-only"
NEXTAUTH_SECRET="your-secret-key"
```

4. **Run the development server**
```bash
npm run dev
```

5. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser

### Running in Frontend-Only Mode

This application can run in a "frontend-only" mode without connecting to a database, which is perfect for testing and demonstration. 

To access the platform in frontend-only mode, use one of these demo accounts:

| Role    | Email              | Password    |
|---------|-------------------|------------|
| User    | demo@example.com   | password123 |
| Teacher | teacher@example.com | password123 |
| Admin   | admin@example.com  | password123 |

## 📁 Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx          # Global layout with theme provider
├── page.tsx            # Homepage with dynamic imports
├── auth/               # Authentication pages
├── teachers/           # Teacher discovery and profiles
├── book/               # Booking flow
└── dashboard/          # Role-specific dashboards

components/             # Reusable React components
├── AuthForm.tsx        # Authentication component
├── Navbar.tsx          # Navigation bar
├── TeacherCard.tsx     # Teacher listing card
├── home/               # Modular home page components
└── ui/                 # UI components

lib/                    # Utility libraries
├── auth.ts             # Authentication configuration
├── prisma.ts           # Database client
└── config.ts           # Application configuration

prisma/                 # Database schema and migrations
└── schema.prisma       # Prisma schema

styles/                 # Global styles
└── globals.css         # Tailwind and global CSS

scripts/                # Utility scripts
└── convert-to-webp.js  # Image optimization script
```

## 🌓 Theme Support

The platform includes a built-in theme switcher that allows users to toggle between:

- 🌙 **Dark Mode** (default): Optimized for low-light environments
- 🌞 **Light Mode**: Traditional bright interface

## 🤝 Contributing

Contributions to كُتّاب are welcome! Areas where help is particularly appreciated:

- Arabic translations and cultural accuracy
- Accessibility improvements
- UI/UX enhancements for Islamic content
- Performance optimizations
- Security enhancements

Please feel free to submit issues or pull requests.

## ⚡ Performance Optimizations

This project implements several performance optimizations:

- **Code Splitting**: The main page is split into modular components that are dynamically imported
- **Selective Hydration**: Components are wrapped in Suspense boundaries for progressive loading
- **Image Optimization**: All images are served in WebP format for faster loading
- **Lazy Loading**: Non-critical components load only when needed
- **Skeleton Loading**: Placeholder UI while content is loading
- **Intersection Observer**: Elements animate only when they enter the viewport

To run image optimization for new assets:

```bash
node scripts/convert-to-webp.js
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For questions, feedback, or support, please [create an issue](https://github.com/yourusername/kottab/issues) on the GitHub repository.

---

<p align="center">
  <b>كُتّاب</b> — منصة تعليمية تسعى لنشر القرآن الكريم بأسلوب بسيط، مباشر، وراقي
</p>