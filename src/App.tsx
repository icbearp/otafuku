import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InquiryForm } from "./components/InquiryForm";
import { PortalSection } from "./components/PortalSection";
import { ExperienceShowcase } from "./components/ExperienceShowcase";
import { BrandMark } from "./components/BrandMark";
import { company } from "./data/company";
import { portals } from "./data/portals";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">跳到主要内容</a>
      <Header />
      <main id="main">
        <Hero />

        <section className="business-section" id="business">
          <div className="section-intro">
            <h2>三条业务线，<br />一个清晰入口。</h2>
            <p>每个板块独立讲专业、产品和服务。熊奇公司负责把长期标准、合作关系与用户信任连接起来。</p>
          </div>
          <div className="portal-list">
            {portals.map((portal, index) => <PortalSection key={portal.id} portal={portal} index={index} />)}
          </div>
        </section>

        <ExperienceShowcase />

        <section className="company-section" id="company">
          <div className="company-statement">
            <h2>不是把三种生意堆在一起，<br />而是让每一次选择都有边界。</h2>
            <p>{company.mission}</p>
          </div>
          <div className="company-principles">
            <article>
              <h3>先把路讲清楚</h3>
              <p>借鉴信息分流站的清晰结构，让不同需求的人快速找到正确入口。</p>
            </article>
            <article>
              <h3>把边界写明白</h3>
              <p>价格、材质、交付和售后只使用已经核验的信息，不用模糊承诺换转化。</p>
            </article>
            <article>
              <h3>一家公司长期负责</h3>
              <p>三个子站独立运营，品牌标准、供应关系和企业合作由熊奇统一承载。</p>
            </article>
          </div>
          <div className="values-line" aria-label="熊奇价值观">
            {company.values.map((value) => <span key={value}>{value}</span>)}
          </div>
        </section>

        <section className="cooperate-section" id="cooperate">
          <div className="cooperate-copy">
            <h2>把一次联系，变成可以推进的合作。</h2>
            <p>供应链、产品共创、企业采购、渠道合作与技术服务，都可以从这里进入。我们会先确认需求和边界，再决定下一步。</p>
            <span className="contact-pending">正式商务邮箱将在上线前公布</span>
          </div>
          <InquiryForm />
        </section>
      </main>

      <footer className="site-footer">
        <BrandMark inverse />
        <div className="footer-company">
          <strong>{company.legalName}</strong>
          <span>公司备案信息、正式邮箱与子站域名将在上线前补充。</span>
        </div>
        <nav aria-label="页脚导航">
          <a href="#business">业务入口</a>
          <a href="#company">公司介绍</a>
          <a href="#cooperate">企业合作</a>
        </nav>
      </footer>
    </>
  );
}
