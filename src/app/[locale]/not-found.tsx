import { NotFoundContent } from "@/components/features/NotFoundContent";

// Next.js renders this page without telling it which language was asked for,
// so the language is read from the address, in the browser.
export default function NotFound() {
  return <NotFoundContent />;
}
