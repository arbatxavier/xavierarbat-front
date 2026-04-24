import { ReactNode } from "react";
import {
  FiMail,
  FiPhone,
} from "react-icons/fi";
import {
  FaWhatsapp,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export interface ContactChannel {
  /** Clave para buscar la traducción en t.contact.labels[key] */
  key: string;
  /** Texto a mostrar (email, número, @handle, etc.) */
  display: string;
  /** URL de destino (mailto:, tel:, https://, etc.) */
  href: string;
  /** Icono React del canal */
  icon: ReactNode;
  /** Clase de hover para el borde de la card */
  hoverBorder: string;
  /** Clase de hover para el color del icono */
  hoverIcon: string;
  /** Clase de hover simple para el footer (ej: hover:text-green-500) */
  hoverSimple: string;
  /** Mostrar en el footer (solo redes sociales) */
  showInFooter: boolean;
}

/**
 * Lista centralizada de canales de contacto.
 *
 * Para añadir un nuevo canal:
 * 1. Añade una entrada aquí.
 * 2. Añade la traducción del label en app/i18n/es.json, ca.json y en.json
 *    dentro de "contact.labels.<key>".
 */
export const contactChannels: ContactChannel[] = [
  {
    key: "email",
    display: "xavixavi97@gmail.com",
    href: "mailto:xavixavi97@gmail.com",
    icon: <FiMail />,
    hoverBorder: "hover:border-accent",
    hoverIcon: "group-hover:text-accent",
    hoverSimple: "hover:text-accent",
    showInFooter: false,
  },
  {
    key: "whatsapp",
    display: "+34 695 315 602",
    href: "https://wa.me/34695315602",
    icon: <FaWhatsapp />,
    hoverBorder: "hover:border-green-500",
    hoverIcon: "group-hover:text-green-500",
    hoverSimple: "hover:text-green-500",
    showInFooter: true,
  },
  {
    key: "phone",
    display: "+34 695 315 602",
    href: "tel:+34695315602",
    icon: <FiPhone />,
    hoverBorder: "hover:border-accent-cyan",
    hoverIcon: "group-hover:text-accent-cyan",
    hoverSimple: "hover:text-accent-cyan",
    showInFooter: true,
  },
  {
    key: "github",
    display: "@arbatxavier",
    href: "https://github.com/arbatxavier",
    icon: <FaGithub />,
    hoverBorder: "hover:border-foreground",
    hoverIcon: "group-hover:text-foreground",
    hoverSimple: "hover:text-foreground",
    showInFooter: true,
  },
  {
    key: "linkedin",
    display: "Xavier Arbat Marquez",
    href: "https://www.linkedin.com/in/xavier-arbat-marquez",
    icon: <FaLinkedinIn />,
    hoverBorder: "hover:border-blue-500",
    hoverIcon: "group-hover:text-blue-500",
    hoverSimple: "hover:text-blue-500",
    showInFooter: true,
  },
  {
    key: "instagram",
    display: "@arbatxavier",
    href: "https://www.instagram.com/arbatxavier/",
    icon: <FaInstagram />,
    hoverBorder: "hover:border-pink-500",
    hoverIcon: "group-hover:text-pink-500",
    hoverSimple: "hover:text-pink-500",
    showInFooter: true,
  },
  {
    key: "x",
    display: "@xavier_arbat",
    href: "https://x.com/xavier_arbat",
    icon: <FaXTwitter />,
    hoverBorder: "hover:border-foreground",
    hoverIcon: "group-hover:text-foreground",
    hoverSimple: "hover:text-foreground",
    showInFooter: true,
  },
  {
    key: "youtube",
    display: "@xavierarbat",
    href: "https://www.youtube.com/@xavierarbat",
    icon: <FaYoutube />,
    hoverBorder: "hover:border-red-500",
    hoverIcon: "group-hover:text-red-500",
    hoverSimple: "hover:text-red-500",
    showInFooter: true,
  },
];
