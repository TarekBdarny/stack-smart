import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import "../../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Smart Stack",
  description:
    "A Place where you can track analyze and manage your store stocks.",
};
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
