import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My FOIA Requests</h1>
              <p className="text-sm text-gray-600">Track and manage your submissions</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>
              View all your FOIA requests and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No requests yet. Submit your first FOIA request to get started!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}