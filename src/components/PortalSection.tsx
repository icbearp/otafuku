import type { Portal } from "../data/portals";

type PortalSectionProps = {
  portal: Portal;
  index: number;
};

function AiMaterial() {
  return (
    <div className="ai-material" role="img" aria-label="AI 订阅服务选择清单，依次核对需求、信息和交付边界">
      <div className="ai-guide">
        <header className="ai-guide__header">
          <strong>订阅选择清单</strong>
          <span>AI SERVICE FIELD GUIDE</span>
        </header>
        <div className="ai-guide__row">
          <span>01 · 需求</span>
          <strong>个人订阅或团队服务</strong>
        </div>
        <div className="ai-guide__row">
          <span>02 · 核验</span>
          <strong>来源、价格与更新时间</strong>
        </div>
        <div className="ai-guide__row">
          <span>03 · 交付</span>
          <strong>开通方式、售后与边界</strong>
        </div>
        <footer className="ai-guide__footer">
          <span>决策顺序</span>
          <strong>先核验，再连接具体服务</strong>
        </footer>
      </div>
    </div>
  );
}

export function PortalSection({ portal, index }: PortalSectionProps) {
  const destinationProps = portal.destination
    ? { href: portal.destination, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <article
      className={`portal portal--${portal.id} ${index % 2 === 1 ? "portal--reverse" : ""}`}
      id={portal.id}
    >
      <div className="portal-copy">
        <h3>{portal.title}</h3>
        <p className="portal-statement">{portal.statement}</p>
        <p className="portal-description">{portal.description}</p>
        <ul className="capability-list" aria-label={`${portal.title}能力`}>
          {portal.capabilities.map((item) => <li key={item}>{item}</li>)}
        </ul>
        {portal.destination ? (
          <a className="portal-link" {...destinationProps}>
            进入独立网站
          </a>
        ) : (
          <span className="portal-link portal-link--pending" aria-disabled="true">
            独立网站筹备中
          </span>
        )}
      </div>
      <figure className="portal-media">
        {portal.image ? <img src={portal.image} alt={portal.imageAlt} loading="lazy" /> : <AiMaterial />}
        <figcaption>{portal.mediaNote}</figcaption>
      </figure>
    </article>
  );
}
