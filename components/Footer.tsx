import Link from "next/link";

export default function Footer() {
  const jaar = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-10">
      <div className="max-w-site mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-text-muted font-sans">
        <p>
          &copy; {jaar}{" "}
          <Link
            href="https://unwatched.nl"
            className="text-brand hover:underline"
          >
            UnWatched
          </Link>{" "}
          — Film &amp; Series Nieuws
        </p>
        <nav className="flex gap-4">
          <Link href="/" className="hover:text-brand transition-colors">
            Home
          </Link>
          <Link
            href="/categorie/film"
            className="hover:text-brand transition-colors"
          >
            Film
          </Link>
          <Link
            href="/categorie/serie"
            className="hover:text-brand transition-colors"
          >
            Series
          </Link>
          <Link
            href="/categorie/streaming"
            className="hover:text-brand transition-colors"
          >
            Streaming
          </Link>
        </nav>
      </div>
    </footer>
  );
}
