import { portals } from "../data/portals";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-watermark" aria-hidden="true">
        <img src="/assets/xiongqi-mark.png" alt="" />
      </div>
      <div className="hero-inner">
        <div className="hero-copy">
          <h1><span>为自己，</span><br /><span>向未知出发。</span></h1>
          <p>杭州熊奇电子商务有限公司以产品、内容与技术连接服装、陶瓷和 AI 科技订阅，建立面向长期经营的品牌业务地图。</p>
          <a className="button button--light" href="#business">
            进入熊奇业务地图
          </a>
        </div>

        <div className="route-map" aria-label="熊奇三大业务板块">
          <div className="route-line" />
          {portals.map((portal, index) => (
            <a
              key={portal.id}
              href={`#${portal.id}`}
              className="route-stop"
              style={{ "--route-delay": `${0.45 + index * 0.12}s` } as React.CSSProperties}
            >
              <span>{portal.englishTitle}</span>
              <strong>{portal.navLabel}</strong>
              <span className="route-action">进入</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
