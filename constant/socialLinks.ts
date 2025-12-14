import { IconType } from "react-icons";
import { FaTiktok, FaFacebookF, FaInstagram } from "react-icons/fa";

export interface SocialLink {
  id: number;
  url: string;
  Icon: IconType;
}

export const socialLinks: SocialLink[] = [
  { id: 1, url: "https://vm.tiktok.com/ZSHTowswjEYM7-r5jAk/", Icon: FaTiktok },
  { id: 2, url: "https://www.facebook.com/profile.php?id=61584030851166", Icon: FaFacebookF },
  { id: 3, url: "https://www.instagram.com/sceniccottage?igsh=MWVjN3RnejJybWs4Ng==", Icon: FaInstagram },
];
