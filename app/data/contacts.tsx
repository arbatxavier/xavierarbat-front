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

export type IconName = 
  | "FiMail" 
  | "FiPhone" 
  | "FaWhatsapp" 
  | "FaLinkedinIn" 
  | "FaInstagram" 
  | "FaYoutube" 
  | "FaGithub" 
  | "FaXTwitter";

export interface ContactChannel {
  key: string;
  display: string;
  href: string;
  iconName: IconName;
  hoverBorder: string;
  hoverIcon: string;
  hoverSimple: string;
  showInFooter: boolean;
}

export const contactChannels: ContactChannel[] = [
  {
    key: "email",
    display: "xavixavi97@gmail.com",
    href: "mailto:xavixavi97@gmail.com",
    iconName: "FiMail",
    hoverBorder: "hover:border-accent",
    hoverIcon: "group-hover:text-accent",
    hoverSimple: "hover:text-accent",
    showInFooter: false,
  },
  {
    key: "whatsapp",
    display: "+34 695 315 602",
    href: "https://wa.me/34695315602",
    iconName: "FaWhatsapp",
    hoverBorder: "hover:border-green-500",
    hoverIcon: "group-hover:text-green-500",
    hoverSimple: "hover:text-green-500",
    showInFooter: true,
  },
  {
    key: "phone",
    display: "+34 695 315 602",
    href: "tel:+34695315602",
    iconName: "FiPhone",
    hoverBorder: "hover:border-accent-cyan",
    hoverIcon: "group-hover:text-accent-cyan",
    hoverSimple: "hover:text-accent-cyan",
    showInFooter: true,
  },
  {
    key: "github",
    display: "@arbatxavier",
    href: "https://github.com/arbatxavier",
    iconName: "FaGithub",
    hoverBorder: "hover:border-foreground",
    hoverIcon: "group-hover:text-foreground",
    hoverSimple: "hover:text-foreground",
    showInFooter: true,
  },
  {
    key: "linkedin",
    display: "Xavier Arbat Marquez",
    href: "https://www.linkedin.com/in/xavier-arbat-marquez",
    iconName: "FaLinkedinIn",
    hoverBorder: "hover:border-blue-500",
    hoverIcon: "group-hover:text-blue-500",
    hoverSimple: "hover:text-blue-500",
    showInFooter: true,
  },
  {
    key: "instagram",
    display: "@arbatxavier",
    href: "https://www.instagram.com/arbatxavier/",
    iconName: "FaInstagram",
    hoverBorder: "hover:border-pink-500",
    hoverIcon: "group-hover:text-pink-500",
    hoverSimple: "hover:text-pink-500",
    showInFooter: true,
  },
  {
    key: "x",
    display: "@xavier_arbat",
    href: "https://x.com/xavier_arbat",
    iconName: "FaXTwitter",
    hoverBorder: "hover:border-foreground",
    hoverIcon: "group-hover:text-foreground",
    hoverSimple: "hover:text-foreground",
    showInFooter: true,
  },
  {
    key: "youtube",
    display: "@xavierarbat",
    href: "https://www.youtube.com/@xavierarbat",
    iconName: "FaYoutube",
    hoverBorder: "hover:border-red-500",
    hoverIcon: "group-hover:text-red-500",
    hoverSimple: "hover:text-red-500",
    showInFooter: true,
  },
];

export function getIcon(name: IconName) {
  switch (name) {
    case "FiMail": return <FiMail />;
    case "FiPhone": return <FiPhone />;
    case "FaWhatsapp": return <FaWhatsapp />;
    case "FaLinkedinIn": return <FaLinkedinIn />;
    case "FaInstagram": return <FaInstagram />;
    case "FaYoutube": return <FaYoutube />;
    case "FaGithub": return <FaGithub />;
    case "FaXTwitter": return <FaXTwitter />;
  }
}
