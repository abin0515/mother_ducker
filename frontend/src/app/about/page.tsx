export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About Our Project
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What We're Building
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            This is a modern full-stack application built with Next.js, TypeScript, and Tailwind CSS. 
            We're exploring the latest web development technologies and best practices.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Frontend Technologies
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Next.js 13+ App Router</li>
                <li>• React 19 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Modern component patterns</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Backend Technologies
              </h3>
              <ul className="text-green-800 space-y-1">
                <li>• Spring Boot microservices</li>
                <li>• Docker containerization</li>
                <li>• Jenkins CI/CD pipeline</li>
                <li>• Kubernetes deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
