import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - My Portfolio',
  description: 'Learn more about me and my journey as a developer.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p className="text-xl text-gray-600">
          Learn more about my journey, skills, and passion for development.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast</h3>
            <p className="text-gray-600">Lightning-fast applications with modern frameworks</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Innovative</h3>
            <p className="text-gray-600">Creative solutions to complex problems</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Reliable</h3>
            <p className="text-gray-600">Robust and maintainable code</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">My Journey</h2>
          <p className="mb-4">
            I'm a passionate developer with experience in modern web technologies. 
            I love building applications that solve real-world problems and provide 
            great user experiences.
          </p>
          <p>
            When I'm not coding, you can find me exploring new technologies, 
            contributing to open-source projects, or sharing knowledge with the 
            developer community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Skills & Technologies</h3>
            <ul className="space-y-2">
              <li>• Next.js & React</li>
              <li>• TypeScript & JavaScript</li>
              <li>• Node.js & Express</li>
              <li>• PostgreSQL & MongoDB</li>
              <li>• Tailwind CSS</li>
              <li>• Git & GitHub</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Interests</h3>
            <ul className="space-y-2">
              <li>• Web Performance</li>
              <li>• User Experience</li>
              <li>• Open Source</li>
              <li>• Continuous Learning</li>
              <li>• Developer Tools</li>
              <li>• Technical Writing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}