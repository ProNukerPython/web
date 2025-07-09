# Marc Castellvi Portfolio 🎬

> A professional portfolio website showcasing lighting, compositing, and technical art expertise in the VFX industry.

[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-95%2B-brightgreen)](https://developers.google.com/web/tools/lighthouse)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-brightgreen)](https://www.w3.org/WAI/WCAG22/quickref/)
[![Modern JS](https://img.shields.io/badge/JavaScript-ES2022-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS-3%20%7C%20Custom%20Properties-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## ✨ Features

- **🎨 Modern Design System**: Clean, accessible interface with dark/light mode support
- **⚡ High Performance**: Lighthouse score 95+ on mobile, optimized images and code
- **♿ Accessibility First**: WCAG 2.2 AA compliant with screen reader support
- **📱 Responsive Design**: Seamless experience across all devices (320px - 2560px)
- **🔍 SEO Optimized**: Meta tags, structured data, and semantic HTML
- **🚀 Interactive Elements**: Skills visualization, smooth animations, video integration
- **📊 Data-Driven**: Dynamic content from JSON, easy to update and maintain
- **🛡️ Security Headers**: CSP, XSS protection, and secure deployment configuration

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/marccastellvi/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## 📁 Project Structure

```
portfolio/
├── assets/                 # Images, videos, and media files
│   ├── banner.jpg
│   ├── profileMarc.jpg
│   ├── Reel-background.mp4
│   └── projects/          # Project thumbnails
├── data/                  # JSON data files
│   └── skills.json        # Skills and experience data
├── .github/workflows/     # CI/CD automation
│   └── ci-cd.yml
├── index.html            # Main portfolio page
├── skills.html           # Interactive skills visualization
├── contact-form.html     # Contact form with validation
├── style-guide.html      # Design system documentation
├── theme.css            # Design system variables
├── styles.css           # Main stylesheet
├── main.js              # Enhanced JavaScript (ES6+)
└── package.json         # Project configuration
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint and Stylelint
npm run test       # Run tests
npm run format     # Format code with Prettier
```

### Code Quality

- **ESLint**: Modern JavaScript linting with ES2022 support
- **Stylelint**: CSS linting with modern features
- **Prettier**: Consistent code formatting
- **Lighthouse CI**: Automated performance and accessibility testing

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Design System

The portfolio uses a comprehensive design system with:

- **Color Palette**: Primary (#007aff), Secondary (#00c6fb), Accent (#ff6b6b)
- **Typography**: System fonts with perfect accessibility contrast ratios
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable UI elements with Figma-like consistency

View the complete design system at `/style-guide.html`

## 📊 Interactive Features

### Skills Visualization
- **D3.js Charts**: Interactive bar, radial, and category charts
- **Real-time Data**: Dynamically loaded from `/data/skills.json`
- **Responsive**: Adapts to all screen sizes
- **Accessible**: Keyboard navigable with screen reader support

### Contact Form
- **Client-side Validation**: Real-time form validation with accessibility
- **Spam Protection**: Honeypot and rate limiting
- **Integration Ready**: Works with Formspree, Netlify Forms, or custom backends

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Deploy to Netlify
npm run build
netlify deploy --prod --dir .
```

### Vercel
```bash
# Deploy to Vercel
vercel --prod
```

### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# CI/CD will automatically deploy on push to main
```

## 📈 Performance Metrics

### Lighthouse Scores (Mobile)
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Core Web Vitals
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## ♿ Accessibility Features

- **WCAG 2.2 AA Compliance**: All contrast ratios meet AA standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Focus Management**: Visible focus indicators and focus trapping
- **Reduced Motion**: Respects user's motion preferences
- **Color Independence**: Information not conveyed by color alone

## 🔧 Configuration

### Environment Variables
```bash
# Optional: For contact form integration
FORMSPREE_ENDPOINT=your_formspree_id
NETLIFY_SITE_ID=your_netlify_site_id
```

### Customization
1. **Colors**: Update CSS custom properties in `theme.css`
2. **Content**: Edit HTML files or JSON data files
3. **Skills**: Update `data/skills.json` for the interactive charts
4. **Assets**: Replace images in the `assets/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Apple's Human Interface Guidelines
- **Accessibility**: Web Content Accessibility Guidelines (WCAG)
- **Performance**: Google's Web.dev best practices
- **Libraries**: D3.js for data visualization

## 📞 Contact

**Marc Castellvi** - Lighting & Compositing Artist

- 📧 Email: [vmarccastellvi@gmail.com](mailto:vmarccastellvi@gmail.com)
- 💼 LinkedIn: [marc-castellvi-vila](https://linkedin.com/in/marc-castellvi-vila)
- 🌐 Portfolio: [marccastellvi.com](https://marccastellvi.com)

---

*Built with ❤️ and modern web technologies for the VFX industry*
