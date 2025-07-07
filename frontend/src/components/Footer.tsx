import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-0">
      <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-gray-500 space-y-2">
        <p className="flex items-center justify-center gap-1">
          © {year} Crafted with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{" "}
          <a
            href="https://github.com/adenijialiuadeyemi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline"
          >
            Adeniji Aliu Adeyemi
          </a>
        </p>
        <p>
          Developed as part of a Full-Stack Developer technical assessment for{" "}
          <span className="font-medium text-gray-700">TOM (The Open Market)</span>.
        </p>
      </div>
    </footer>
  );
}
