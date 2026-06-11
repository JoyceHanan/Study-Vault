/**
 * common.js — BMW Design System Style Tokens
 * Based on BMW Type Next Latin / corporate blue design language.
 * All values use Tailwind utility classes with inline CSS where needed.
 *
 * Font note: BMW Type Next Latin is a licensed typeface.
 * Substitute: Inter (700 / 300) — add to your project via Google Fonts or local.
 */

// ─── Layout ──────────────────────────────────────────────────────────────────

export const pageWrapper =
  "min-h-screen bg-white font-sans";

export const centeredFlex =
  "flex items-center justify-center";

export const container =
  "w-full max-w-[1440px] mx-auto px-8";

export const sectionPadding =
  "py-20"; // spacing.section = 80px

export const sectionPaddingLight =
  "py-16"; // 64px — footer rhythm

// ─── Surfaces ────────────────────────────────────────────────────────────────

/** Default page surface — #ffffff */
export const surfaceCanvas =
  "bg-white";

/** Soft grey — footer, sub-nav bands — #f7f7f7 */
export const surfaceSoft =
  "bg-[#f7f7f7]";

/** Light plate behind model card photos — #fafafa */
export const surfaceCard =
  "bg-[#fafafa]";

/** Slightly heavier section divider — #ebebeb */
export const surfaceStrong =
  "bg-[#ebebeb]";

/** Dark navy hero bands — #1a2129 */
export const surfaceDark =
  "bg-[#1a2129]";

/** Elevated card on dark hero — #262e38 */
export const surfaceDarkElevated =
  "bg-[#262e38]";

// ─── Cards ───────────────────────────────────────────────────────────────────

/** Standard content card — white, square corners, no shadow */
export const card =
  "bg-white border border-[#e6e6e6] p-6";

/** Model card — white plate, 0px radius */
export const modelCard =
  "bg-white p-6";

/** Model card photo plate — soft grey fill, edge-to-edge */
export const modelCardPhoto =
  "bg-[#fafafa] w-full";

/** Feature / lifestyle card */
export const featureCard =
  "bg-white p-6";

/** Inventory card — denser padding */
export const inventoryCard =
  "bg-white p-4";

/** Dark hero band */
export const heroBandDark =
  "bg-[#1a2129] text-white px-20 py-20 w-full";

/** Light hero photo band */
export const heroPhotoBand =
  "bg-white text-[#262626] px-20 py-20 w-full";

/** Pre-footer CTA band */
export const ctaBandPhoto =
  "bg-[#1a2129] text-white px-20 py-20 w-full text-center";

// ─── Typography ──────────────────────────────────────────────────────────────

/** display-xl — 64px / 700 — hero model name */
export const displayXl =
  "text-[64px] font-bold leading-[1.05] tracking-normal text-[#262626]";

/** display-lg — 48px / 700 — section heads */
export const displayLg =
  "text-[48px] font-bold leading-[1.1] tracking-normal text-[#262626]";

/** display-md — 32px / 700 — sub-section / CTA band */
export const displayMd =
  "text-[32px] font-bold leading-[1.15] tracking-normal text-[#262626]";

/** display-sm — 24px / 700 — spec cell value */
export const displaySm =
  "text-[24px] font-bold leading-[1.25] tracking-normal text-[#262626]";

/** title-lg — 20px / 700 — card group title */
export const titleLg =
  "text-[20px] font-bold leading-[1.3] tracking-normal text-[#262626]";

/** title-md — 18px / 700 — model card title, intro paragraphs */
export const titleMd =
  "text-[18px] font-bold leading-[1.4] tracking-normal text-[#262626]";

/** title-sm — 16px / 700 — inventory card title */
export const titleSm =
  "text-[16px] font-bold leading-[1.4] tracking-normal text-[#262626]";

/** body-md — 16px / 300 Light — default running text */
export const bodyText =
  "text-[16px] font-light leading-[1.55] text-[#3c3c3c]";

/** body-sm — 14px / 300 Light — footer, fine print */
export const bodyTextSm =
  "text-[14px] font-light leading-[1.55] text-[#3c3c3c]";

/** caption — 12px / 400 — photo captions, meta */
export const captionText =
  "text-[12px] font-normal leading-[1.4] tracking-[0.5px] text-[#6b6b6b]";

/** label-uppercase — 13px / 700 / 1.5px tracking — "LEARN MORE" CTAs, tabs */
export const labelUppercase =
  "text-[13px] font-bold leading-[1.3] tracking-[1.5px] uppercase text-[#262626]";

/** nav-link — 14px / 400 */
export const navLink =
  "text-[14px] font-normal leading-[1.4] tracking-[0.3px] text-[#262626]";

// ─── Semantic text helpers ────────────────────────────────────────────────────

/** Primary/dark text — #262626 */
export const heroTitle =
  "text-[48px] font-bold leading-[1.1] tracking-normal text-[#262626]";

/** Muted text — #6b6b6b */
export const mutedText =
  "text-[14px] font-light leading-[1.55] text-[#6b6b6b]";

/** On-dark heading — white */
export const onDarkTitle =
  "text-[48px] font-bold leading-[1.1] tracking-normal text-white";

/** On-dark body — soft white #bbbbbb */
export const onDarkMuted =
  "text-[14px] font-light leading-[1.55] text-[#bbbbbb]";

/** Error text */
export const errorText =
  "text-[#dc2626] text-sm font-light mt-1";

// ─── Buttons ─────────────────────────────────────────────────────────────────

/**
 * button-primary — BMW Blue, 0px radius, 48px height
 * Pair with: disabled:bg-[#d6d6d6] disabled:text-[#6b6b6b] disabled:cursor-not-allowed
 */
export const primaryBtn =
  "inline-flex items-center justify-center bg-[#1c69d4] text-white text-[14px] font-bold tracking-[0.5px] px-8 h-12 hover:bg-[#0653b6] transition-colors duration-150 disabled:bg-[#d6d6d6] disabled:text-[#6b6b6b] disabled:cursor-not-allowed";

/**
 * button-secondary — white with hairline border, 0px radius
 */
export const secondaryBtn =
  "inline-flex items-center justify-center bg-white text-[#262626] text-[14px] font-bold tracking-[0.5px] px-8 h-12 border border-[#cccccc] hover:border-[#262626] transition-colors duration-150";

/**
 * button-secondary-on-dark — transparent with white border
 */
export const secondaryBtnOnDark =
  "inline-flex items-center justify-center bg-transparent text-white text-[14px] font-bold tracking-[0.5px] px-8 h-12 border border-white hover:bg-white/10 transition-colors duration-150";

/**
 * button-text-link — uppercase inline CTA, no background
 * Usage: <button className={textLinkBtn}>LEARN MORE ›</button>
 */
export const textLinkBtn =
  "inline-flex items-center gap-1 bg-transparent text-[#262626] text-[13px] font-bold tracking-[1.5px] uppercase hover:text-[#1c69d4] transition-colors duration-150";

// ─── Inputs ───────────────────────────────────────────────────────────────────

/**
 * text-input — 0px radius, 48px height, hairline border
 * Focus: border thickens to ink (#262626)
 */
export const textInput =
  "w-full bg-white text-[#262626] text-[16px] font-light leading-[1.55] px-4 h-12 border border-[#e6e6e6] outline-none focus:border-[#262626] transition-colors duration-150 placeholder:text-[#9a9a9a]";

// ─── Filter / Tag Chips ───────────────────────────────────────────────────────

/** Inactive filter chip */
export const filterChip =
  "inline-flex items-center bg-white text-[#262626] text-[12px] font-normal tracking-[0.5px] px-[14px] py-2 border border-[#cccccc] cursor-pointer hover:border-[#262626] transition-colors duration-150";

/** Active filter chip */
export const filterChipActive =
  "inline-flex items-center bg-[#262626] text-white text-[12px] font-normal tracking-[0.5px] px-[14px] py-2 border border-[#262626] cursor-pointer";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

/** Inactive category tab */
export const categoryTab =
  "text-[13px] font-bold tracking-[1.5px] uppercase text-[#6b6b6b] py-3 border-b-2 border-transparent hover:text-[#262626] transition-colors duration-150 cursor-pointer";

/** Active category tab */
export const categoryTabActive =
  "text-[13px] font-bold tracking-[1.5px] uppercase text-[#262626] py-3 border-b-2 border-[#262626] cursor-pointer";

// ─── Spec Cell ────────────────────────────────────────────────────────────────

export const specCell =
  "p-6 border-b border-[#e6e6e6]";

export const specValue =
  "text-[24px] font-bold leading-[1.25] text-[#262626]";

export const specLabel =
  "text-[13px] font-bold tracking-[1.5px] uppercase text-[#6b6b6b] mt-1";

// ─── Dividers ─────────────────────────────────────────────────────────────────

/** 1px hairline divider */
export const hairline =
  "border-t border-[#e6e6e6]";

/** M tricolor stripe — M-model contexts only */
export const mStripeDivider =
  "h-1 w-full";
// Render as: <div className={mStripeDivider} style={{ background: 'linear-gradient(to right, #0066b1 33.3%, #1c69d4 33.3% 66.6%, #e22718 66.6%)' }} />

// ─── Navigation ───────────────────────────────────────────────────────────────

export const topNav =
  "sticky top-0 z-50 w-full bg-white h-16 flex items-center px-8 border-b border-[#e6e6e6]";

// ─── Footer ───────────────────────────────────────────────────────────────────

export const footer =
  "bg-[#f7f7f7] text-[#3c3c3c] py-16 px-8";

export const footerLink =
  "text-[14px] font-light leading-[1.55] text-[#6b6b6b] hover:text-[#262626] transition-colors duration-150";

// ─── Configurator ─────────────────────────────────────────────────────────────

/** Inactive option tile */
export const configuratorTile =
  "bg-white text-[#262626] text-[16px] font-light px-6 py-4 border border-[#e6e6e6] cursor-pointer hover:border-[#262626] transition-colors duration-150";

/** Selected option tile */
export const configuratorTileSelected =
  "bg-white text-[#262626] text-[16px] font-light px-6 py-4 border-2 border-[#1c69d4] cursor-pointer";

// ─── Color Reference (non-Tailwind use, e.g. inline styles / charts) ──────────

export const colors = {
  primary: "#1c69d4",
  primaryActive: "#0653b6",
  primaryDisabled: "#d6d6d6",
  ink: "#262626",
  body: "#3c3c3c",
  bodyStrong: "#1a1a1a",
  muted: "#6b6b6b",
  mutedSoft: "#9a9a9a",
  hairline: "#e6e6e6",
  hairlineStrong: "#cccccc",
  canvas: "#ffffff",
  surfaceSoft: "#f7f7f7",
  surfaceCard: "#fafafa",
  surfaceStrong: "#ebebeb",
  surfaceDark: "#1a2129",
  surfaceDarkElevated: "#262e38",
  onPrimary: "#ffffff",
  onDark: "#ffffff",
  onDarkSoft: "#bbbbbb",
  mBlueLight: "#0066b1",
  mBlueDark: "#1c69d4",
  mRed: "#e22718",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#dc2626",
};