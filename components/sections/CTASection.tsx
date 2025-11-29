import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? I'd love to hear about it and help bring your ideas to life.
          </p>

          <ActionButtons />
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}

function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      <Link
        href="/contact"
        className="px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-pulse-slow"
      >
        Start a Project
      </Link>
      
      <Link
        href="/portfolio"
        className="px-12 py-5 border border-gray-600 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
      >
        View My Work
      </Link>
    </div>
  );
}

function SocialLinks() {
  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/yourusername' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/yourusername' },
    { name: 'Twitter', href: 'https://twitter.com/yourusername' },
    { name: 'Instagram', href: 'https://instagram.com/yourusername' },
  ];

  return (
    <div className="mt-16 flex justify-center space-x-8 text-gray-400">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-400 transition-colors duration-300 transform hover:scale-110"
        >
          {social.name}
        </a>
      ))}
    </div>
  );
}