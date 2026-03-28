import { redirect } from "next/navigation";

// Root path redirects straight to the event types page
export default function HomePage() {
  redirect("/event-types");
}
