import type { FallbackContact } from "./types";

/** Contacts are not i18n-dependent (same data for all locales) */
export const fallbackContacts: FallbackContact[] = [
  { name: "whatsapp", display: "WhatsApp", value: "+34 695 315 602", link: "https://wa.me/34695315602", showInFooter: true },
  { name: "github", display: "GitHub", value: "@arbatxavier", link: "https://github.com/arbatxavier", showInFooter: true },
  { name: "linkedin", display: "LinkedIn", value: "Xavier Arbat Marquez", link: "https://www.linkedin.com/in/xavier-arbat-marquez", showInFooter: true },
  { name: "instagram", display: "Instagram", value: "@arbatxavier", link: "https://www.instagram.com/arbatxavier/", showInFooter: true },
  { name: "x", display: "X (Twitter)", value: "@xavier_arbat", link: "https://x.com/xavier_arbat", showInFooter: true },
  { name: "youtube", display: "YouTube", value: "@xavierarbat", link: "https://www.youtube.com/@xavierarbat", showInFooter: true },
  { name: "email", display: "Email", value: "xavixavi97@gmail.com", link: "mailto:xavixavi97@gmail.com", showInFooter: true },
  { name: "phone", display: "Phone", value: "+34 695 315 602", link: "tel:+34695315602", showInFooter: false },
];
