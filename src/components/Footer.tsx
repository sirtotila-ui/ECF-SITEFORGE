import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">
              SiteForge <span className="text-muted font-normal">by ECF Media</span>
            </span>
          </div>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} ECF Media. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <a href="mailto:info@ecfmedia.it" className="hover:text-foreground">
              Contatti
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
