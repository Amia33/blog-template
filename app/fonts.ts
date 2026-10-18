import { M_PLUS_1, M_PLUS_1_Code, Noto_Sans_SC } from "next/font/google";

export const mPlus1 = M_PLUS_1({
  subsets: ["latin"],
  variable: "--font-mplus",
  display: "swap",
});

export const mPlus1Code = M_PLUS_1_Code({
  subsets: ["latin"],
  variable: "--font-mplus-code",
  display: "swap",
});

export const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
  display: "swap",
});
