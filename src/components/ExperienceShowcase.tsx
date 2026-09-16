import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";

function useTransition<T>(state: T) {
  const root = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !root.current) return;
    const targets = root.current.querySelectorAll("[data-motion]");
    const animation = animate(targets, {
      opacity: [0.38, 1],
      y: [12, 0],
      delay: stagger(65),
      duration: 470,
      ease: "out(4)",
    });
    return () => { animation.revert(); };
  }, [state]);
  return root;
}

const apparelScenes = [
  { title: "版型，从身体出发", body: "围绕男士通勤与日常活动的穿着习惯，观察肩线、衣长和活动余量。最终版型以实物打样与试穿反馈为准。" },
  { title: "面料，让一天更从容", body: "关注触感、透气性与多次穿着后的状态。具体材质成分和护理方式将在商品正式发布时公布。" },
  { title: "背面，也值得被看见", body: "背部结构与细节是后续产品开发的重要方向。完整背面与 360° 展示将在多角度样片完成后接入。" },
];

const ceramicStages = [
  { label: "陶土", title: "从材料开始", body: "器物的比例、重量和手感，先从选材与成型设想开始。" },
  { label: "绘画", title: "留下人的笔触", body: "纹样与釉面表达仍在探索；不同技法会形成不同的表面语言。" },
  { label: "烧制", title: "交给温度完成", body: "烧成过程决定最终色泽与质感，工艺参数将在产品确认后披露。" },
  { label: "成品", title: "回到日常使用", body: "最终作品需要同时回应观感、手感与实际使用场景。" },
];

const aiUses = [
  { label: "写代码", title: "从想法到可运行的原型", prompt: "把需求拆成步骤，生成初稿，再由你审查和测试。", output: "需求梳理 → 代码草稿 → 测试与迭代" },
  { label: "处理工作", title: "把重复工作还给时间", prompt: "整理长文档、提取待办、起草邮件和会议摘要。", output: "输入资料 → 提炼重点 → 人工确认" },
  { label: "学习研究", title: "更快找到下一步", prompt: "比较不同观点，形成问题清单，再回到原始资料核验。", output: "提出问题 → 比较信息 → 核查来源" },
];

function ApparelExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLImageElement>(null);
  const [color, setColor] = useState<"navy" | "black" | "white">("navy");
  const [active, setActive] = useState(0);
  const detailRef = useTransition(active);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        if (productRef.current) productRef.current.style.transform = `rotateY(${Math.round((progress - 0.5) * 30)}deg)`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return <section className="experience experience--apparel" id="apparel-story" ref={sectionRef} aria-labelledby="apparel-story-title">
    <div className="experience-heading"><span>服装 · 产品视角</span><h2 id="apparel-story-title">一件衣服，<br />不止正面。</h2><p>滑动页面，观察样品的角度变化；选择颜色与设计关注点，预览我们计划如何讲清一件衣服。</p></div>
    <div className="apparel-stage">
      <div className="apparel-visual">
        <div className="apparel-orbit" aria-hidden="true" />
        <img ref={productRef} className={`apparel-product apparel-product--${color}`} src="/assets/apparel-polo.png" alt="男士 POLO 现有样品正面，颜色预览为视觉示意" />
        <span className="stage-corner stage-corner--top">PRODUCT STUDY / 01</span><span className="stage-corner stage-corner--bottom">正面样品 · 角度演示 ±15°</span>
      </div>
      <div className="apparel-details" ref={detailRef}>
        <span className="experience-index">穿着研究 / 现有样品</span>
        <h3 data-motion>{apparelScenes[active].title}</h3><p data-motion>{apparelScenes[active].body}</p>
        <div className="story-options" role="group" aria-label="服装设计关注点">
          {apparelScenes.map((scene, index) => <button key={scene.title} type="button" className={active === index ? "is-active" : ""} onClick={() => setActive(index)} aria-pressed={active === index}><span>0{index + 1}</span>{scene.title}</button>)}
        </div>
        <div className="color-controls" role="group" aria-label="颜色概念预览"><span>颜色概念</span>{(["navy", "black", "white"] as const).map((item) => <button key={item} type="button" className={`color-choice color-choice--${item} ${color === item ? "is-active" : ""}`} onClick={() => setColor(item)} aria-label={`${item === "navy" ? "深蓝" : item === "black" ? "黑色" : "白色"}概念预览`} aria-pressed={color === item} />)}</div>
        <small>黑、白色仅为同一张样品图的视觉模拟；不代表实物颜色。完整 3D 与背面展示需要产品多角度素材。</small>
      </div>
    </div>
  </section>;
}

function CeramicExperience() {
  const [stage, setStage] = useState(0);
  const detailRef = useTransition(stage);
  return <section className="experience experience--ceramic" id="ceramic-story" aria-labelledby="ceramic-story-title">
    <div className="experience-heading"><span>陶瓷 · 工艺叙事</span><h2 id="ceramic-story-title">一件器物的时间，<br />应该被看见。</h2><p>从陶土到成品，沿着四个阶段理解我们希望呈现的制作故事。</p></div>
    <div className="ceramic-stage"><div className="ceramic-scene"><img src="/assets/ceramics-studio-v1.png" alt="陶瓷杯、浅碗与花器的品牌概念场景" style={{ transform: `scale(1.12) translateX(${(stage - 1.5) * -2.5}%)` }} /><div className="ceramic-scene-caption">品牌概念场景 / 非实际工序照片</div></div><div className="ceramic-narrative" ref={detailRef}><span className="experience-index">工艺路径 / 0{stage + 1} — 04</span><h3 data-motion>{ceramicStages[stage].title}</h3><p data-motion>{ceramicStages[stage].body}</p><div className="process-steps" role="group" aria-label="陶瓷工艺阶段">{ceramicStages.map((item, index) => <button key={item.label} type="button" className={stage === index ? "is-active" : ""} aria-pressed={stage === index} onClick={() => setStage(index)}><span>0{index + 1}</span><strong>{item.label}</strong></button>)}</div><small>目前为工艺叙事原型。实拍工序、材质与烧制参数需在产品落地后替换核验。</small></div></div>
  </section>;
}

function AiExperience() {
  const [use, setUse] = useState(0);
  const workflowRef = useTransition(use);
  return <section className="experience experience--ai" id="ai-story" aria-labelledby="ai-story-title"><div className="experience-heading"><span>AI 科技 · 工作流</span><h2 id="ai-story-title">少一点切换，<br />多一点完成。</h2><p>不是把所有工具摆在一起，而是从任务出发，找到适合的服务与使用方法。</p></div><div className="ai-workspace"><div className="ai-use-list" role="group" aria-label="AI 使用场景">{aiUses.map((item, index) => <button type="button" key={item.label} className={use === index ? "is-active" : ""} aria-pressed={use === index} onClick={() => setUse(index)}><span>0{index + 1}</span><strong>{item.label}</strong><span aria-hidden="true">↗</span></button>)}</div><div className="ai-workflow"><div className="ai-workflow-bar"><span>熊奇 AI / 场景探索</span><span className="ai-status">示意工作流</span></div><div className="ai-workflow-content" ref={workflowRef}><span className="experience-index">当前任务 / {aiUses[use].label}</span><h3 data-motion>{aiUses[use].title}</h3><div className="workflow-prompt" data-motion><span>你可以这样开始</span><p>{aiUses[use].prompt}</p></div><div className="workflow-output" data-motion><span>建议路径</span><strong>{aiUses[use].output}</strong></div></div></div></div><p className="ai-disclaimer">未来的订阅页将按平台分别披露官方服务、适用场景、价格、开通方式与售后边界。此处不代表任何平台的授权或销售承诺。</p></section>;
}

export function ExperienceShowcase() {
  return <div className="experience-collection"><ApparelExperience /><CeramicExperience /><AiExperience /></div>;
}
