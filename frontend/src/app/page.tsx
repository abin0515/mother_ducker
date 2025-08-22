export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your New Project
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start building your amazing application from here
          </p>
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🚀 Ready to Build
            </h2>
            <p className="text-gray-600 mb-6">
              Your frontend is set up with Next.js 13+ App Router, TypeScript, and Tailwind CSS. 
              Start creating your components and pages!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">✅ Next.js 13+</h3>
                <p className="text-sm text-blue-600">App Router with Server Components</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">✅ TypeScript</h3>
                <p className="text-sm text-green-600">Full type safety and IntelliSense</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">✅ Tailwind CSS</h3>
                <p className="text-sm text-purple-600">Utility-first styling framework</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">✅ Cursor Rules</h3>
                <p className="text-sm text-orange-600">Development guidelines ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
