
export const navStyles = {
  panel: "glass-card border-white/10 relative overflow-hidden bg-black/40 backdrop-blur-[32px] transition-all duration-500",
  glowContainer: "absolute inset-0 pointer-events-none -z-10",
  primaryGlow: "absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full",
  secondaryGlow: "absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-secondary/10 to-transparent",
  branding: {
    container: "flex flex-col items-center text-center",
    title: "font-black text-gradient italic uppercase tracking-tighter leading-none",
    subtitle: "text-[10px] text-[#F4F7FF]/70 font-black uppercase tracking-[0.4em] leading-relaxed",
    divider: "h-0.5 w-full bg-vibrant-gradient rounded-full shadow-[0_0_20px_rgba(255,79,216,0.3)]"
  },
  navItem: {
    base: "flex items-center transition-all font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl",
    active: "bg-vibrant-gradient text-[#050816] shadow-2xl shadow-primary/40 scale-[1.05]",
    inactive: "text-[#F4F7FF]/50 hover:text-white hover:bg-white/5"
  },
  accountBox: "rounded-3xl bg-gradient-to-br from-white/5 to-transparent p-6 border border-white/5 relative overflow-hidden group"
};
