# Next.js + Tailwind + shadcn/ui Project

A modern web development stack featuring Next.js 15, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

- **Next.js 15** - Latest version with App Router and React 19
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components built with Radix UI
- **TypeScript** - Full type safety
- **ESLint** - Code linting and formatting

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Lucide React](https://lucide.dev/) - Icon library

## 📦 Included Components

The project comes with these shadcn/ui components pre-installed:

- Button
- Card
- Input
- Dialog
- Badge

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Adding More Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add dropdown-menu
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   └── lib/
│       └── utils.ts
├── components.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Configuration

- **Tailwind CSS**: Configured with CSS variables for theming
- **shadcn/ui**: Set up with "new-york" style and neutral base color
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Documentation](https://react.dev)

## 🤝 Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
