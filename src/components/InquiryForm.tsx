import { FormEvent, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function InquiryForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "提交失败，请稍后重试。");
      setState("success");
      setMessage(result.message || "信息已收到，我们会尽快联系你。");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "提交失败，请稍后重试。");
    }
  }

  return (
    <form className="inquiry-form" onSubmit={submitInquiry}>
      <label className="website-field" aria-hidden="true">
        <span>公司网站</span>
        <input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-grid">
        <label>
          <span>你的称呼</span>
          <input name="name" type="text" autoComplete="name" required minLength={2} maxLength={60} placeholder="怎么称呼你" />
        </label>
        <label>
          <span>联系方式</span>
          <input name="contact" type="text" required minLength={5} maxLength={120} placeholder="邮箱、微信或电话" />
        </label>
      </div>
      <label>
        <span>合作方向</span>
        <select name="business" defaultValue="" required>
          <option value="" disabled>请选择业务板块</option>
          <option value="apparel">服装业务</option>
          <option value="ceramics">陶瓷业务</option>
          <option value="ai">AI 科技订阅</option>
          <option value="company">公司级合作</option>
        </select>
      </label>
      <label>
        <span>你想推进的事情</span>
        <textarea name="message" required minLength={10} maxLength={1000} rows={5} placeholder="请简单说明合作需求、产品方向或希望解决的问题" />
      </label>
      <label className="consent-row">
        <input name="consent" type="checkbox" required />
        <span>我同意熊奇仅将以上信息用于本次业务联系。</span>
      </label>
      <button className="button button--dark submit-button" type="submit" disabled={state === "loading"}>
        {state === "loading" ? "正在提交" : "提交合作意向"}
      </button>
      {message && (
        <p className={`form-message form-message--${state}`} role={state === "error" ? "alert" : "status"}>
          {message}
        </p>
      )}
    </form>
  );
}
