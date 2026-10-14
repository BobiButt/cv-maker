import { Link } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-4 rounded-2xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-slate-900">
          Build your CV in minutes
        </h1>
        <p className="text-lg text-slate-600">
          Free, open source, and private. Your data never leaves your browser.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/editor"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Start building
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition"
          >
            My CVs
          </Link>
          <a
            href="https://github.com/BobiButt/cv-maker"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Star on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
