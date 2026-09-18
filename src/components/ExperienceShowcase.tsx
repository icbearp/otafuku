import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

const Apparel3DStory = lazy(() => import("./ThreeStories").then((module) => ({ default: module.Apparel3DStory })));
const Ceramic3DStory = lazy(() => import("./ThreeStories").then((module) => ({ default: module.Ceramic3DStory })));

const aiUses = [
  { label: "写代码", title: "从想法到可运行的原型", prompt: "把需求拆成步骤，生成初稿，再由你审查和测试。", output: "需求梳理 → 代码草稿 → 测试与迭代" },
  { label: "处理工作", title: "把重复工作还给时间", prompt: "整理长文档、提取待办、起草邮件和会议摘要。", output: "输入资料 → 提炼重点 → 人工确认" },
  { label: "学习研究", title: "更快找到下一步", prompt: "比较不同观点，形成问题清单，再回到原始资料核验。", output: "提出问题 → 比较信息 → 核查来源" },
];

function DeferredStory({ kind }: { kind: "apparel" | "ceramic" }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!hostRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: "1200px" });
    observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!near || window.location.hash !== `#${kind}-story`) return;
    const timer = window.setTimeout(() => {
      const target = hostRef.current;
      if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior: "instant" });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [kind, near]);
  const fallback = <div className={`story-loading story-loading--${kind}`}><img src={kind === "apparel" ? "/assets/apparel-polo.png" : "/assets/ceramics-studio-v1.png"} alt="" /><span>正在准备 3D 产品场景</span></div>;
  return <div id={`${kind}-story`} ref={hostRef}>{near ? <Suspense fallback={fallback}>{kind === "apparel" ? <Apparel3DStory /> : <Ceramic3DStory />}</Suspense> : fallback}</div>;
}

function AiExperience() {
  const [use, setUse] = useState(0);
  const workflowRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !workflowRef.current) return;
    const animation = animate(workflowRef.current.querySelectorAll("[data-motion]"), {
      opacity: [.38, 1], y: [12, 0], delay: stagger(65), duration: 470, ease: "out(4)",
    });
    return () => { animation.revert(); };
  }, [use]);
  return <section className="experience experience--ai" id="ai-story" aria-labelledby="ai-story-title"><div className="experience-heading"><span>AI 科技 · 工作流</span><h2 id="ai-story-title">少一点切换，<br />多一点完成。</h2><p>不是把所有工具摆在一起，而是从任务出发，找到适合的服务与使用方法。</p></div><div className="ai-workspace"><div className="ai-use-list" role="group" aria-label="AI 使用场景">{aiUses.map((item, index) => <button type="button" key={item.label} className={use === index ? "is-active" : ""} aria-pressed={use === index} onClick={() => setUse(index)}><span>0{index + 1}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></button>)}</div><div className="ai-workflow"><div className="ai-workflow-bar"><span>熊奇 AI / 场景探索</span><span className="ai-status">示意工作流</span></div><div className="ai-workflow-content" ref={workflowRef}><span className="experience-index">当前任务 / {aiUses[use].label}</span><h3 data-motion>{aiUses[use].title}</h3><div className="workflow-prompt" data-motion><span>你可以这样开始</span><p>{aiUses[use].prompt}</p></div><div className="workflow-output" data-motion><span>建议路径</span><strong>{aiUses[use].output}</strong></div></div></div></div><p className="ai-disclaimer">未来的订阅页将按平台分别披露官方服务、适用场景、价格、开通方式与售后边界。此处不代表任何平台的授权或销售承诺。</p></section>;
}

export function ExperienceShowcase() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash !== "#apparel-story" && hash !== "#ceramic-story") return;
    const target = document.getElementById(hash.slice(1));
    requestAnimationFrame(() => target?.scrollIntoView({ block: "start", behavior: "instant" }));
  }, []);
  return <div className="experience-collection"><DeferredStory kind="apparel" /><DeferredStory kind="ceramic" /><AiExperience /></div>;
}
