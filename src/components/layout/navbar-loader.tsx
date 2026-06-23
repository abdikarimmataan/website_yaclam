import { Navbar } from "@/components/layout/navbar";
import { getSiteSettings } from "@/lib/api/settings.service";

export const dynamic = "force-dynamic";

export async function NavbarLoader() {
  const settings = await getSiteSettings();
  return <Navbar settings={settings} />;
}
