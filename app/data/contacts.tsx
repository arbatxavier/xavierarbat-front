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
