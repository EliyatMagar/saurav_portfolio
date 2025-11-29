import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Creative Digital Influencer & Designer',
  description: 'Discover the journey of a multi-talented content creator, YouTuber, and graphics designer passionate about digital innovation.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-30 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            About The Creator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Digital Storyteller • Visual Artist • Content Innovator
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-gray-400">Subscribers</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-3xl font-bold text-pink-400 mb-2">500+</div>
            <div className="text-gray-400">Videos Created</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-3xl font-bold text-blue-400 mb-2">1000+</div>
            <div className="text-gray-400">Designs</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-3xl font-bold text-green-400 mb-2">5+</div>
            <div className="text-gray-400">Years Experience</div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/25">
              <span className="text-3xl">🎬</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Content Creation</h3>
            <p className="text-gray-400">
              Crafting engaging videos and digital content that resonates with audiences worldwide
            </p>
          </div>
          
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-pink-500/25">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Visual Design</h3>
            <p className="text-gray-400">
              Creating stunning graphics and visual experiences that tell compelling stories
            </p>
          </div>
          
          <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/25">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Digital Influence</h3>
            <p className="text-gray-400">
              Building communities and driving trends through authentic digital presence
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            My Creative Journey
          </h2>
          <div className="space-y-4 text-gray-300">
            <p>
              As a multi-faceted digital creator, I've spent years mastering the art of online 
              storytelling through various mediums. From YouTube videos that entertain and educate, 
              to stunning graphics that capture attention, my mission is to create memorable 
              digital experiences.
            </p>
            <p>
              What started as a passion for design and content creation has evolved into a 
              thriving digital presence. I believe in the power of visual storytelling and 
              its ability to connect people across the globe.
            </p>
            <p>
              When I'm not creating content, you'll find me exploring new design trends, 
              experimenting with video techniques, or engaging with my amazing community 
              of followers and supporters.
            </p>
          </div>
        </div>

        {/* Skills & Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Creative Skills
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Video Production</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Motion Graphics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>UI/UX Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Brand Identity</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Social Media Strategy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Content Planning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Digital Marketing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Community Building</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Platforms & Tools
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Adobe Creative Suite</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Figma</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Final Cut Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>YouTube Studio</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Instagram/TikTok</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Canva</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Blender</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>After Effects</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Let's Create Something Amazing</h3>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Ready to collaborate on your next project or just want to chat about digital content? 
              I'm always excited to connect with fellow creators and brands.
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}