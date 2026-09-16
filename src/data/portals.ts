export type Portal = {
  id: "apparel" | "ceramics" | "ai";
  navLabel: string;
  title: string;
  englishTitle: string;
  statement: string;
  description: string;
  capabilities: string[];
  destination: string | null;
  image: string | null;
  imageAlt: string;
  mediaNote: string;
};

export const portals: Portal[] = [
  {
    id: "apparel",
    navLabel: "服装",
    title: "服装与日常穿着",
    englishTitle: "APPAREL",
    statement: "从一件真正愿意反复穿的衣服开始。",
    description:
      "围绕男士通勤、日常与轻出行场景，先用真实反馈验证版型、面料、质量和复购，再形成熊奇自己的核心产品。",
    capabilities: ["男士生活方式服装", "小单与低 MOQ", "OEM / ODM 合作"],
    destination: null,
    image: "/assets/apparel-polo.png",
    imageAlt: "深海军蓝男士速干珠地 POLO 样品",
    mediaNote: "当前产品测试样品，具体规格与销售状态以子站上线信息为准。",
  },
  {
    id: "ceramics",
    navLabel: "陶瓷",
    title: "陶瓷与生活器物",
    englishTitle: "CERAMICS",
    statement: "把材料、手感与日常仪式做成能被使用的作品。",
    description:
      "探索兼具实用性与情绪价值的陶瓷器物、礼赠产品和原创共创。所有产品将以材质、工艺和安全说明为进入市场的前提。",
    capabilities: ["日用器物方向", "礼赠与共创", "工艺与供应合作"],
    destination: null,
    image: "/assets/ceramics-studio-v1.png",
    imageAlt: "森林绿与米白釉面的杯、浅碗和小花器陶瓷概念组合",
    mediaNote: "陶瓷业务概念视觉，由品牌方向生成，不代表已量产或在售商品。",
  },
  {
    id: "ai",
    navLabel: "AI 科技",
    title: "AI 科技与订阅",
    englishTitle: "AI TECHNOLOGY",
    statement: "先讲清选择，再连接真正适合的服务。",
    description:
      "面向个人与小团队整理 AI 订阅、数字服务与使用指南。产品信息、交付方式、售后边界和风险提示将独立核验、持续更新。",
    capabilities: ["AI 订阅导航", "价格与路径说明", "使用指南与售后入口"],
    destination: null,
    image: null,
    imageAlt: "AI 科技业务信息路径图",
    mediaNote: "首期只建立信息与服务框架，不展示未经核验的价格、库存或承诺。",
  },
];
