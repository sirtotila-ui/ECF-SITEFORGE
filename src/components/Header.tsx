import Link from "next/link";
import { Zap } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span>
            SiteForge <span className="text-muted font-normal">by ECF Media</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#come-funziona" className="text-sm text-muted transition-colors hover:text-foreground">
            Come funziona
          </a>
          <a href="#pacchetti" className="text-sm text-muted transition-colors hover:text-foreground">
            Pacchetti
          </a>
          <a href="#faq" className="text-sm text-muted transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>
        <Link
          href="#pacchetti"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Inizia ora
        </Link>
      </div>
    </header>
  );
}
