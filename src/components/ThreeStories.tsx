import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CanvasTexture, Color, Mesh, MeshStandardMaterial, RepeatWrapping, Vector3 } from "three";

gsap.registerPlugin(ScrollTrigger);

type StoryKind = "apparel" | "ceramic";
type ApparelColor = "navy" | "black" | "white";
type ProgressRef = { current: number };

const shirtColors: Record<ApparelColor, string> = {
  navy: "#202d4b", black: "#151918", white: "#dce0dc",
};

const apparelChapters = [
  { title: "一件衣服，从完整轮廓开始。", text: "参考现有男士 POLO 样品，建立可旋转的概念模型。滚动继续，镜头会走向值得细看的地方。", align: "left" },
  { title: "领口与门襟，决定第一眼。", text: "领口形态、纽扣位置与门襟比例影响穿着观感；最终结构仍以实物打样为准。", align: "left" },
  { title: "走近布面，理解日常穿着。", text: "从下摆到布面，关注贴身触感、透气与活动空间。当前 3D 材质仅模拟视觉，不代表已核验的面料成分。", align: "right" },
  { title: "转过身，看见完整设计。", text: "最后回到整体，并展示背面轮廓。概念模型并非产品扫描，实际背部工艺需多角度实拍核验。", align: "left" },
] as const;

const ceramicChapters = [
  { title: "从泥胚开始，让形状出现。", text: "原料准备、成型与缓慢干燥，决定器物最初的比例与手感。" },
  { title: "纹样与釉色，在表面相遇。", text: "彩绘与施釉的先后会随工艺而异；这一层是参考图的绿色表面设计概念。" },
  { title: "经过火，成为器物。", text: "素烧、施釉与釉烧是常见路径。高光变化模拟烧成后的釉面，不代表具体窑温或配方。" },
  { title: "让成品回到生活里。", text: "镜头绕行一周，观察杯、碗与花器的整体关系。具体材质与安全标准待实物核验。" },
] as const;

function smooth(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function interpolate(points: number[], progress: number) {
  const p = Math.max(0, Math.min(1, progress)) * (points.length - 1);
  const i = Math.min(points.length - 2, Math.floor(p));
  return points[i] + (points[i + 1] - points[i]) * smooth(p - i);
}

function CameraRig({ kind, progress }: { kind: StoryKind; progress: ProgressRef }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new Vector3(), []);
  useFrame(() => {
    const p = progress.current;
    if (kind === "apparel") {
      const angle = interpolate([0, .1, .3, Math.PI], p);
      const fit = size.width < 600 ? 1.5 : 1.1;
      const radius = interpolate([5.5, 2.2, 1.65, 4.4], p) * fit;
      camera.position.set(Math.sin(angle) * radius, interpolate([.05, .84, -.78, .04], p), Math.cos(angle) * radius);
      target.set(0, interpolate([0, .77, -.72, 0], p), 0);
    } else {
      const orbit = smooth((p - .75) / .25) * Math.PI * 2;
      const radius = size.width < 600 ? 8.2 : 4.7;
      camera.position.set(Math.sin(orbit) * radius, size.width < 600 ? 2.2 : 1.55, Math.cos(orbit) * radius);
      target.set(0, -.05, 0);
    }
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  });
  return null;
}

function ShirtModel({ color }: { color: ApparelColor }) {
  const { scene } = useGLTF("/models/polo_shirt.glb");
  const knit = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#eee";
      context.fillRect(0, 0, 64, 64);
      context.fillStyle = "#d3d3d3";
      for (let y = 0; y < 64; y += 8) for (let x = 0; x < 64; x += 8) {
        context.beginPath();
        context.ellipse(x + (y % 16 ? 4 : 0), y, 1.6, 2.8, 0, 0, Math.PI * 2);
        context.fill();
      }
    }
    const texture = new CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(18, 28);
    return texture;
  }, []);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => {
      if (node instanceof Mesh) node.material = (node.material as MeshStandardMaterial).clone();
    });
    return copy;
  }, [scene]);
  useEffect(() => {
    model.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      const mat = node.material as MeshStandardMaterial;
      const base = new Color(shirtColors[color]);
      mat.color.copy(node.name.startsWith("collar") || node.name.startsWith("cuff") || node.name === "placket" ? base.multiplyScalar(.82) : base);
      if (node.name === "pique_body" || node.name.startsWith("sleeve")) {
        mat.bumpMap = knit;
        mat.bumpScale = .045;
      }
      mat.needsUpdate = true;
    });
  }, [model, color, knit]);
  return <primitive object={model} />;
}

function CeramicModel({ progress }: { progress: ProgressRef }) {
  const { scene } = useGLTF("/models/ceramic_set.glb");
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => {
      if (node instanceof Mesh) {
        const mat = (node.material as MeshStandardMaterial).clone();
        mat.transparent = true;
        mat.depthWrite = false;
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = node.parent?.name === "mesh_glazed" ? -2 : node.parent?.name === "mesh_painted" ? -1 : 0;
        node.material = mat;
      }
    });
    return copy;
  }, [scene]);
  useFrame(() => {
    const p = progress.current;
    const painted = smooth((p - .2) / .16);
    const glazed = smooth((p - .46) / .19);
    const paintedLayer = model.getObjectByName("mesh_painted");
    const glazedLayer = model.getObjectByName("mesh_glazed");
    if (paintedLayer) paintedLayer.position.y = (1 - painted) * .18;
    if (glazedLayer) glazedLayer.position.y = (1 - glazed) * .28;
    model.traverse((node) => {
      if (!(node instanceof Mesh)) return;
      const mat = node.material as MeshStandardMaterial;
      if (node.parent?.name === "mesh_clay") mat.opacity = 1;
      if (node.parent?.name === "mesh_painted") mat.opacity = painted;
      if (node.parent?.name === "mesh_glazed") {
        mat.opacity = glazed;
        mat.roughness = .88 - .62 * smooth((p - .58) / .1);
        mat.envMapIntensity = .35 + 1.45 * smooth((p - .58) / .1);
      }
    });
  });
  return <primitive object={model} />;
}

function StudioEnvironment({ kind }: { kind: StoryKind }) {
  return <>
    <ambientLight intensity={kind === "apparel" ? 1.5 : 1.25} />
    <directionalLight position={[3, 6, 5]} intensity={kind === "apparel" ? 2.1 : 2.6} color={kind === "apparel" ? "#e9efff" : "#fff0d8"} />
    <directionalLight position={[-4, 2, -3]} intensity={1.1} color="#d2e9de" />
    <Environment resolution={128}>
      <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 5, 4]} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={2} color={kind === "apparel" ? "#b3c7ed" : "#e9c9a3"} position={[-4, 2, 1]} scale={[2, 5, 1]} />
    </Environment>
  </>;
}

function Scene({ kind, progress, color }: { kind: StoryKind; progress: ProgressRef; color: ApparelColor }) {
  return <>
    <StudioEnvironment kind={kind} />
    <CameraRig kind={kind} progress={progress} />
    <Suspense fallback={null}>
      {kind === "apparel" ? <ShirtModel color={color} /> : <CeramicModel progress={progress} />}
    </Suspense>
    {kind === "apparel" && <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={.09} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} minAzimuthAngle={-Math.PI} maxAzimuthAngle={Math.PI} />}
  </>;
}

function useScrollStory(sectionRef: React.RefObject<HTMLElement | null>, progress: ProgressRef, invalidateRef: React.MutableRefObject<(() => void) | null>) {
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      gsap.to(progress, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom bottom",
          scrub: reduceMotion ? false : .35,
          onUpdate: (self) => {
            progress.current = self.progress;
            invalidateRef.current?.();
          },
        },
      });
      gsap.utils.toArray<HTMLElement>(".immersive-step").forEach((step) => {
        gsap.fromTo(step.querySelector(".immersive-step__content"), { opacity: .35, y: reduceMotion ? 0 : 30 }, {
          opacity: 1, y: 0, ease: "none",
          scrollTrigger: { trigger: step, start: "top 75%", end: "top 28%", scrub: true },
        });
      });
    }, element);
    return () => context.revert();
  }, [sectionRef, progress, invalidateRef]);
}

function ImmersiveStory({ kind }: { kind: StoryKind }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const invalidate = useRef<(() => void) | null>(null);
  const [color, setColor] = useState<ApparelColor>("navy");
  const [webgl] = useState(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      return !!document.createElement("canvas").getContext("webgl2");
    } catch { return false; }
  });
  useScrollStory(sectionRef, progress, invalidate);
  const chapters = kind === "apparel" ? apparelChapters : ceramicChapters;
  return <section ref={sectionRef} className={`immersive-story immersive-story--${kind}`} aria-label={kind === "apparel" ? "服装 3D 滚动展示" : "陶瓷 3D 工艺展示"}>
    <div className="immersive-stage" aria-hidden="true">
      {webgl ? <Canvas frameloop="demand" dpr={[1, 1.6]} camera={{ position: [0, 0, 4.5], fov: kind === "apparel" ? 38 : 43 }} onCreated={({ invalidate: requestFrame }) => { invalidate.current = requestFrame; requestFrame(); }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}><Scene kind={kind} progress={progress} color={color} /></Canvas> : <img src={kind === "apparel" ? "/assets/apparel-polo.png" : "/assets/ceramics-studio-v1.png"} alt="" />}
      <div className="immersive-stage__label">{kind === "apparel" ? "POLO / 3D CONCEPT" : "CERAMICS / PROCESS CONCEPT"}</div>
      <div className="immersive-stage__hint">向下滚动，进入细节</div>
    </div>
    <div className="immersive-track">
      {chapters.map((chapter, index) => <article key={chapter.title} className={`immersive-step immersive-step--${"align" in chapter ? chapter.align : index % 2 ? "right" : "left"}`}>
        <div className="immersive-step__content"><span className="immersive-step__number">{String(index + 1).padStart(2, "0")} / 04</span><h2>{chapter.title}</h2><p>{chapter.text}</p>{kind === "apparel" && index === 0 && <div className="immersive-colors" role="group" aria-label="Polo 概念颜色">{(["navy", "black", "white"] as const).map((choice) => <button key={choice} className={`immersive-colors__${choice} ${color === choice ? "is-active" : ""}`} type="button" onClick={() => { setColor(choice); invalidate.current?.(); }} aria-pressed={color === choice} aria-label={`${choice === "navy" ? "深蓝" : choice === "black" ? "黑" : "白"}色概念`}/>)}</div>}</div>
      </article>)}
    </div>
    <div className="immersive-note">3D 模型依据参考图片程序化制作，供设计演示；不是实物扫描或已核验商品。{kind === "ceramic" ? "成型、素烧、施釉和釉烧为常见流程，具体产品工艺待确认。" : "面料、背部结构与颜色以未来实物为准。"}</div>
  </section>;
}

export function Apparel3DStory() { return <ImmersiveStory kind="apparel" />; }
export function Ceramic3DStory() { return <ImmersiveStory kind="ceramic" />; }

useGLTF.preload("/models/polo_shirt.glb");
useGLTF.preload("/models/ceramic_set.glb");
