import FOIARequestForm from '@/components/foia-request-form';
import { FileText, Sparkles, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FOIA AI Automation</h1>
                <p className="text-sm text-gray-600">AI-Powered Freedom of Information Act Requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Powered by AI
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Automate Your FOIA Requests with AI
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Submit Freedom of Information Act requests faster and more effectively with AI-powered assistance. 
            Generate professional request descriptions, fee waiver justifications, and expedited processing explanations.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Content</h3>
              <p className="text-sm text-gray-600">
                Let AI craft professional, legally sound request descriptions and justifications
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">FOIA.gov Compliant</h3>
              <p className="text-sm text-gray-600">
                Fully compliant with FOIA.gov API v1.1.0 specification for seamless submission
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Efficient</h3>
              <p className="text-sm text-gray-600">
                Save hours of work with automated form filling and intelligent suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 pb-24">
        <div className="container mx-auto">
          <FOIARequestForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>Built with Next.js, Drizzle ORM, and OpenAI</p>
          <p className="mt-2">Compliant with FOIA.gov API Specification v1.1.0</p>
        </div>
      </footer>
    </div>
  );
}