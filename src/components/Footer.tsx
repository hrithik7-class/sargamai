import Link from "next/link";
import { Twitter, Github, Linkedin, Music2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-500 border-t border-lavender-600 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-jet-black font-heading">
                Sargam
              </span>
            </Link>
            <p className="text-neutral-300 text-sm mb-4">
              AI-powered music lyrics generator. Transform your ideas into meaningful lyrics.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-300 hover:text-teal transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-teal transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-teal transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-jet-black mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/logic" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Try Demo
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-jet-black mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-jet-black mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-300 hover:text-teal transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-lavender-600">
          <p className="text-center text-neutral-300 text-sm">
            © {new Date().getFullYear()} Sargam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
