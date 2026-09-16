import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = window.localStorage.getItem("xiongqi-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("xiongqi-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const close = () => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandMark />
        <nav className={`primary-nav ${menuOpen ? "primary-nav--open" : ""}`} aria-label="主导航">
          <a href="#business" onClick={close}>三大板块</a>
          <a href="#company" onClick={close}>关于熊奇</a>
          <a href="#cooperate" onClick={close}>企业合作</a>
          <a className="nav-cta" href="#business" onClick={close}>选择业务入口</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={theme === "light" ? "切换到深色模式" : "切换到浅色模式"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "深色" : "浅色"}
          </button>
          <button
            ref={menuButtonRef}
            className="icon-button menu-button"
            type="button"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "关闭" : "菜单"}
          </button>
        </div>
      </div>
    </header>
  );
}
