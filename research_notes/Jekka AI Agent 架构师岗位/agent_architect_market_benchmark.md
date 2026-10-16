# Agent 架构师 (AI Agent Architect) Market Benchmark, 2025–2026 — with emphasis on Chinese customer-service / e-commerce agent startups

Research date: 2026-10-16. Method note: this environment could not fetch pages directly (every WebFetch attempt failed with DNS errors, including v2ex.com, nowcoder, nbd.com.cn, ashbyhq, prosple and inews.qq.com). All findings below come from web-search result snippets and summaries. Several job-board numbers (猎聘 / BOSS直聘 / 智联) appear only in search snippets, and many are undated beyond the page's "2026年" label. Treat individual postings as samples, not statistics.

Evidence tiers used throughout:
- **[POSTED]**: an employer's or job board's advertised range for a specific opening.
- **[PLATFORM-AGG]**: a platform report averaging posted pay or counting postings (脉脉, 猎聘, BOSS直聘, 智联, 前程无忧). These reflect advertised pay, not realized pay.
- **[SELF-REPORTED]**: crowd-sourced pay (Levels.fyi, Glassdoor, offer-爆料 articles).
- **[3P-ESTIMATE]**: blogs, training-company articles, recruiter guides. Low reliability.
- **[MY ESTIMATE]**: my own arithmetic or inference. Not a source.

---

## Q1. How do comparable employers define "Agent 架构师 / AI Agent 架构师 / 智能体架构师 / 大模型应用架构师" (and US "Agent Engineer / Agent Architect / FDE / AI Solutions Architect")? Which responsibilities and requirements recur? How does the architect role differ from adjacent titles?

### Takeaway
Across Chinese and US postings, an "Agent architect" designs and owns the whole agent system: the multi-agent and orchestration architecture, the tool-calling and function-calling layer that connects business systems, context/memory/planning, RAG, guardrails, an evaluation framework (accuracy, hallucination, safety) and cost/latency trade-offs through model routing, under high-concurrency production constraints. In China the title usually sits above "Agent 工程师 / 大模型应用工程师" and typically asks for 5–10 years of experience. At US customer-service-agent vendors (Parloa, Airtable) "Agent Architect" is often a customer-facing deployment and conversation-design role, sitting next to Forward Deployed Engineers rather than above them. Sierra and Decagon use "Agent Engineer," which has new-grad entry points.

### Cited Findings

**Context: what Jekka is (for interpreting the opening)**
- Jekka's legal entity is 杭州西格莫伊德智能科技有限公司. The site footer lists offices in Singapore, Hong Kong, Wilmington and Hangzhou. Products listed: voice AI agents for inbound and outbound customer interactions, an e-commerce customer-service product, and an e-commerce shopping assistant. — [Jekka.ai](https://jekka.ai/)
- A CAREC seminar deck (Fall 2024) describes Jekka as backed by several well-known USD VCs. — [CAREC AI Seminar 2024 – Jekka](https://www.carecprogram.org/uploads/6.-CAREC-AI-Seminar-2024-Jekka-Shopify.pdf)
- In a podcast interview (2025-10), founder Aaron: (a) emphasizes reliability and treats the degree of SOP execution as the quantifiable metric; (b) says Jekka's differentiator is owning the underlying model capability for "真人级" (human-level) AI; (c) describes the business model as outcome-driven, usage-based pricing. Jekka says it serves several domestic and international Fortune-500 companies. The team includes people from MSRA, Amazon, Google and Alibaba. — [53AI transcript: 从 Sierra 到 Jekka](https://www.53ai.com/news/zhinengkefu/2025102892538.html); [小宇宙 episode](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437)
- Jekka's self-reported "90%+ resolution rate" claims are unverified marketing. — [aishenqi listing](https://aishenqi.net/tool/jekka-ai) (flagged as self-promotional)

**Chinese definitions of Agent 架构师 / AI 应用架构师 (Agent 方向)**
- [POSTED, V2EX, ~mid-2026, roughly 134 days before the search] 塔斯汀 (Tastien), 高级 AI 应用架构师（Agent 方向）, Shanghai, on-site, 20–40K·14薪. The company is building an enterprise AI Agent platform. Responsibilities: lead **Context Engineering and Multi-Agent architecture design**; build an **Agent Skill ecosystem, Tool Calling system and Workflow orchestration platform**; own the Agent system architecture and core modules (**Prompt Pipeline, Memory, Planning, Tool System**); handle **high concurrency, low latency and stability**. Requirements: complete AI Agent / LLM application development experience, the ability to independently design and implement agent systems, and deep understanding of **ReAct, Plan-and-Execute, Reflection, Tool Use and Multi-Agent collaboration**. Years and education were not visible in the snippet. — [V2EX t/1217892](https://www.v2ex.com/t/1217892); duplicate post under the 效率工程 team: [V2EX t/1217867](https://www.v2ex.com/t/1217867)
- [3P / aggregated JD summaries] Agent architects are described as overall designers of multi-agent systems. They plan the division of labor and collaboration between agents, wrap existing enterprise systems as agent-callable tools, design guardrails against dangerous outputs, build **agent evaluation frameworks** quantifying accuracy, hallucination rate and safety, and manage **multi-model routing to balance cost and latency**. Common skill asks: LangGraph/LangChain, **MCP, Function Calling, RAG**, and 0-to-1 product delivery. Some postings also ask for familiarity with AI coding tools (Cursor, Claude Code). Education and experience asks vary widely, from "master's + 10 years" to experience-over-degree. — summarized from search results including [京北方 Agent 算法架构师 (智联)](https://www.zhaopin.com/jobdetail/CC315847110J40865278007.htm), [Randstad: Agent Harness 架构师, Shenzhen](https://www.randstad.cn/jobs/agent-harnessjia-gou-shi_shenzhen_90M0151014_18823_CN/), [V2EX 远程 Agent 架构师](https://www.v2ex.com/t/1234434), [CSDN/ADG guide](https://adg.csdn.net/6a2b79b010ee7a33f27b8948.html)
- [POSTED] SF Express (顺丰), 大模型应用系统架构师: lead full-lifecycle architecture design, set model-selection and fine-tuning strategy, own cloud-edge-device deployment and service governance. Master's degree, 5–10 years. — [顺丰招聘](https://hr.sf-express.com/JobSearchById/61769,3)
- [Government career portal, 2025-08] CHSI/NCSS calls the AI 大模型架构师 a "pyramid-top" role: building the AI technical architecture, planning integration of LLMs with the data middle platform and business systems, and setting cloud/edge deployment strategy. — [学职平台 (CHSI)](https://xz.chsi.com.cn/xz/zyts/202508/20250806/2293395165.html); [NCSS](https://www.ncss.cn/ncss/jydt/jy/202508/20250805/2293396116.html)

**E-commerce / customer-service flavored JDs (China)**
- [POSTED, via search snippet] An e-commerce employer's LLM role: design and build LLM-oriented e-commerce business systems covering **chat/dialogue systems and consumer-service systems (pre-sale, after-sale)**. Requires 3+ years of internet development and architecture experience, a Java stack and system-architecture ability; e-commerce systems experience preferred. — [LeetCode 招聘帖: 大模型应用开发工程师](https://leetcode.cn/circle/discuss/Q0PfSO/) (source attribution in snippet is approximate)
- [POSTED] Meituan 到家: apply LLMs to interactive dialogue scenarios such as smart assistants, **customer service and telesales**. Requires master's or above, NLP fundamentals, Transformer/BERT/GPT, and LLM fine-tuning and evaluation. — [知乎 招聘帖](https://zhuanlan.zhihu.com/p/677287905)
- [POSTED] Another enterprise JD lists 0-to-1 AI application engineering for **智能客服, 智能导购 (shopping guide), 智能选品** and LLM business-agent systems, with Python (Django/Flask/FastAPI), MySQL and Redis. — [国家大学生就业服务平台 job detail](https://www.ncss.cn/student/jobs/EtMoJgBpBGZXHvZyinAdwc/detail.html)
- 晓多科技 (Xiaoduo) positions itself as an intelligent-dialogue solutions vendor centered on **e-commerce customer-service agents**, with a core team from 百度 NLP and 京东 JIMI. No current Agent-architect JD was found in search. — [xiaoduoai.com](https://www.xiaoduoai.com/)
- 乐言科技's careers page, as indexed, showed mainly big-data and PM roles and no agent-architect role. Search found no indexed Agent-architect JDs for 智齿科技, 网易七鱼, 容联七陌 or 中关村科金. — [乐言科技 joinUS](https://www.leyantech.com/joinUS.html)
- Search returned no first-party 淘天 / 抖音电商 / 扣子 / 钉钉 "Agent 架构师" JD text, only third-party pages.

**Chinese model labs: agent-related titles**
- [POSTED, 猎聘, 2026-07-17] MiniMax Shanghai, "AI 服务端工程师（Agent 方向）", 40–60K/month. — [猎聘 MiniMax job](https://www.liepin.com/job/1984221441.shtml)
- [POSTED, aggregator DataHub, data as of 2026-09-19] MiniMax Shanghai "AI 全栈工程师（Agent 方向）" 35–55K. Moonshot (月之暗面) Shanghai "Agent 全栈工程师" 25–50K (posted 2026-05-08), plus Beijing "高级 Agent 研发工程师" roles. — [DataHub MiniMax](https://datahub.ac.cn/ai-jobs/topics/minimax-jobs.html); [DataHub 月之暗面](https://datahub.ac.cn/ai-jobs/companies/company-819fc19826.html)
- Note on titles: these labs mostly label agent work "Agent 工程师 / Agent 全栈 / AI 服务端（Agent 方向）", not "架构师".

**US peers**
- Sierra describes the **AI agent engineer** as a strong software engineer whose role differs from other engineering jobs. Postings describe owning the full agent development lifecycle (pilot → production → ongoing tuning), building agents for enterprises and startups, and feeding customer insights back into the platform. Qualifications: building or deploying AI/LLM systems in production, **eval frameworks, agent tooling, RAG pipelines, prompt engineering**, React/TypeScript/Go, and customer-facing or external-stakeholder project leadership. One listing asks for founder or founding-engineer experience. No minimum years stated. Sierra also posts **"Software Engineer, Agent (New Grad 2027)"** and a leadership track "Agent Engineer, TLM". — [Sierra blog: Meet the AI agent engineer](https://sierra.ai/blog/meet-the-ai-agent-engineer); [Sierra Ashby: Software Engineer, Agent](https://jobs.ashbyhq.com/Sierra/e9f5fdb6-91ee-4c55-9230-41ec8865650e); [Agent Engineer, TLM](https://jobs.ashbyhq.com/Sierra/1a0a0334-41f8-4c15-9ed8-615336855e5e); [New Grad 2027 via Jobright](https://jobright.ai/jobs/info/6a95f517f28891320e85f4e9)
- Some databases file Sierra's "agent engineer" under forward-deployed engineering and others don't. — [Aced: Sierra FDE](https://www.aced.io/jobs/fde/sierra)
- **Parloa, "Lead AI Agent Architect"** (voice CX agents; NY and Germany variants): part of the **Professional Services** team that manages end-to-end deployment. The role scopes and rolls out AI-agent deployments and advises customers and partners, analyzes customer requirements and writes precise prompts, decomposes complex processes, and **works with Forward Deployed Engineers** to connect CRMs and ticketing systems through APIs. It also applies **SSML to tune TTS pronunciation** to brand standards, troubleshoots production, and documents best practices. Requirements: **4+ years** (some versions **6+ years**) in customer-facing technical or enterprise roles, hands-on conversation design and AI-agent development, chain-of-thought and few-shot prompting, API and enterprise-system integration, and stakeholder management and mentoring. A SAP variant adds SAP Service Cloud/CRM integration. — [Greenhouse: Parloa Lead AI Agent Architect](https://job-boards.greenhouse.io/parloa/jobs/4566280101); [General Catalyst board](https://jobs.generalcatalyst.com/companies/parloa/jobs/71585669-lead-ai-agent-architect); [Parloa Lead Agent Architect – SAP](https://job-boards.eu.greenhouse.io/parloa/jobs/4866190101)
- Airtable posts "AI Agent Architect, Customer Experience" (remote US) for AI-driven customer support. Salary not shown in the snippet. — [The SaaS Jobs](https://www.thesaasjobs.com/jobs/465258160-ai-agent-architect-customer-experience)
- Intercom: hiring push in Berlin of about 100 engineers, AI researchers and designers focused on the **Fin AI agent**. No titles or pay found. — search summary of [Intercom, Inc. (Wikipedia)](https://en.wikipedia.org/wiki/Intercom,_Inc.)

**How the title differs from adjacent roles**
- 大模型应用工程师 "uses" models: business adaptation with LangChain, RAG and agent frameworks, producing workflows and knowledge bases. 大模型开发工程师 "changes" models: fine-tuning, training, deployment optimization. — [CSDN Agent 社区: 应用工程师 vs 开发工程师](https://agent.csdn.net/6a744e6510ee7a33f2973b8a.html); [icyanblue 对比](https://www.icyanblue.com/post/8717.html)
- The Agent engineer is described as "system-centric": cognitive architecture, memory systems, tool integration and multi-agent collaboration, rather than model tuning. — [知乎: 零基础如何入门 AI Agent](https://zhuanlan.zhihu.com/p/1950973465575289880)
- A typical progression is 初级 → 中级 → 高级应用工程师 → **AI 解决方案架构师** → 首席架构师. — [CSDN Agent 社区](https://agent.csdn.net/6a744e6510ee7a33f2973b8a.html)
- 知乎 discussion: many companies use a "大模型应用工程师" JD to hire "AI Agent 工程师", which creates mismatches, so candidates should ask whether the job is "calling APIs to build apps" or "building agent systems". Document parsing, agent building and tool writing may sit under algorithm or development teams, and the boundary is unclear. — [知乎: 大模型相关岗位全解析](https://zhuanlan.zhihu.com/p/2004969517344900750); [知乎 question: 2026 大模型/agent 工作还好找吗](https://www.zhihu.com/question/2056397531488298203)
- FDE vs Agent Architect at Parloa: the Agent Architect owns scoping, prompting, conversation design and voice tuning on the professional-services side. The FDE handles system integration through APIs. — [Greenhouse: Parloa](https://job-boards.greenhouse.io/parloa/jobs/4566280101)
- A "解决方案架构师" in China at big clouds is presales/solutions-facing, e.g. "弹性计算 Agent 解决方案架构师" in Hangzhou at a large internet company. — [猎聘 杭州 search results](https://www.liepin.com/city-hz/zpxfzjjfajgsh18h/)

### Inferences
- Jekka's product mix (text and voice customer service, e-commerce shopping assistant, SOP-adherence metric, usage/outcome pricing, enterprise customers) maps closely onto the Sierra/Parloa model. An "Agent 架构师" there plausibly blends (a) the Chinese platform-architect scope (multi-agent orchestration, tool and SOP execution, memory, eval, latency and cost) with (b) the Parloa/Sierra deployment scope (turning each customer's SOPs, integrations and voice requirements into a reliable agent). Voice-specific items (TTS/SSML, latency, barge-in) are likely relevant given Jekka's voice product. This is an inference; Jekka's actual JD was outside this research scope.
- Recurring must-haves across both markets: tool/function calling and system integration, RAG, multi-agent/workflow orchestration, evaluation and observability, and production reliability (latency, concurrency, cost). MCP and context engineering appear mainly in newer (2025–2026) and more senior postings.
- At a seed-to-Series-A company, "架构师" is often a scope label (the person who designs the agent stack) rather than a strict seniority grade. Big-company postings with the same title almost always demand 5–10 years.

### Gaps
- No first-party JD text was retrievable from 阿里/淘天/蚂蚁/钉钉/通义, 字节/抖音电商/扣子, 晓多, 乐言, 智齿, 容联七陌, 中关村科金, 网易七鱼 or 智谱 for an "Agent 架构师" title. Direct fetches were blocked and search surfaced none.
- Decagon's agent-role responsibilities and requirements beyond title and pay were not retrievable (prosple and Indeed pages could not be fetched).
- Intercom Fin and PolyAI agent-role titles and JDs were not found.

---

## Q2. What experience and education are expected? Is a fresh M.S. graduate realistically competitive for an "architect" title, and which junior variants exist?

### Takeaway
Posted "Agent 架构师 / AI 架构师" roles in China overwhelmingly ask for **5–10 years** (sometimes 7+), usually with a bachelor's minimum and a master's preferred at SOEs and large firms. Parloa asks for 4–6+ years of customer-facing technical experience. A fresh M.S. graduate is not a typical fit for an architect title at a large company. At a seed/A startup, a candidate with real shipped production agent systems can be credible for a scoped "architect" or founding-engineer role, but should benchmark the offer against senior-engineer or new-grad agent-engineer pay rather than the 5–10-year architect bands. Junior variants are plentiful: Agent 开发工程师 (校招), 大模型应用开发工程师, AI 应用工程师, Agent interns, and US "Agent Engineer, New Grad" at Sierra and Decagon.

### Cited Findings

**Experience asks on architect-titled postings [POSTED, 猎聘/BOSS snippets, page labels "2026"]**
- Beijing, listed internet company, Agent 架构师, 70–100K·18薪, **5–10 years**. — [猎聘 AGENT架构师 search](https://www.liepin.com/s/adykrjjgzsxmk15k0u/)
- Shenzhen 福田, Agent 架构师, 70–100K·15薪, **5+ years**. — [猎聘 AGENT架构师 search](https://www.liepin.com/s/adykrjjgzsxmk15k0u/)
- BYD-related Agent 平台架构师 (Beijing/Shanghai/Shenzhen; Shenzhen 坪山), **5–10 years**, bachelor's. — [猎聘 AGENT架构师 search](https://www.liepin.com/s/adykrjjgzsxmk15k0u/)
- Hangzhou 西湖区, 资深 AI 智能体架构/开发专家 (listed pharma company, via headhunter), **5–10 years**, bachelor's. Hangzhou AI 架构师, **7+ years**. Hangzhou 弹性计算 Agent 解决方案架构师, **5–10 years**. Hangzhou 余杭 大模型产品解决方案架构师, **5–10 years**. — [猎聘 杭州 results](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/); [猎聘 杭州 架构师](https://www.liepin.com/city-hz/career/360321/)
- Exceptions: Hangzhou "AI 模型架构师", 55–85K·13薪, **1–3 years, master's**; a quant firm's Hangzhou "LLM 智能体开发 (AI Agent)", 60–90K·30薪, **experience not required**. — [猎聘 杭州 results](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/)
- SF Express 大模型应用系统架构师: **master's, 5–10 years**. — [顺丰招聘](https://hr.sf-express.com/JobSearchById/61769,3)
- Parloa Lead AI Agent Architect: **4+ years** in enterprise customer-facing roles in some versions, **6+ years** in others. — [Greenhouse: Parloa](https://job-boards.greenhouse.io/parloa/jobs/4566280101)
- Sierra agent roles: no minimum years stated. New-grad and intern versions exist. The TLM version requires technical leadership and team growth. — [Sierra Ashby TLM](https://jobs.ashbyhq.com/Sierra/1a0a0334-41f8-4c15-9ed8-615336855e5e); [Sierra New Grad 2027](https://jobright.ai/jobs/info/6a95f517f28891320e85f4e9)

**Seniority frames [3P]**
- Aliyun developer article: Agent path tiers of prototype delivery (0–1 yr), enterprise-grade systems (1–3 yrs) and foundational breakthroughs (3+ yrs). — [阿里云开发者社区: 想入行 AI Agent](https://developer.aliyun.com/article/1709668)
- 知乎 roadmap: application-type at 1–3 yrs, full-stack-type at 3–5 yrs, research-type at 5–10 yrs. — [知乎 roadmap](https://zhuanlan.zhihu.com/p/1950973465575289880)

**Demand shift by level [PLATFORM-AGG]**
- 猎聘 × 清华 AI report (2026-06): AI-agent talent demand grew **40%**. **Since Q3 2025, entry-level (入门级) and intermediate (进阶级) demand declined while expert (专家级) and leader (领军级) demand kept growing.** The largest demand for data/compute, physical AI and **agent building** is at intermediate and expert levels. — [腾讯新闻: 猎聘、清华联手发 AI 报告](https://view.inews.qq.com/a/20260618A04X5K00?scene=news-skill) (seen only via search snippet; full report not read)
- 前程无忧 2026届校招 AI report (2025-08): employers weight math and algorithm fundamentals (60.3%) and real projects, internships or competitions (52.5%) most heavily. — [神州学人网](http://www.chisa.edu.cn/bussiness/202508/t20250826_2111382322.html); [新浪 前程无忧](https://k.sina.cn/article_7879848900_1d5acf3c401902o95m.html?from=tech)

**Junior variants a new graduate can target (with posted pay where found)**
- [POSTED, 牛客] 钛动科技 "2026校招 – Agent 开发工程师", Guangzhou/Beijing/**Hangzhou**, **18–30K·15薪**, bachelor's, 2026 grads preferred. — [牛客](https://www.nowcoder.com/jobs/detail/441167?urlSource=sitemap)
- [POSTED, 牛客] 百度 "大模型应用 – Agent 框架后端开发工程师" (internship). — [牛客](https://www.nowcoder.com/jobs/detail/321712)
- [POSTED, BOSS] Hangzhou "AI 应用工程师（AI 技术应用）" 15–30K·14薪 (滨江); Hangzhou "AI 服务端开发" 30–60K·16薪 (西溪). — [BOSS直聘 杭州 AI 技术工程师](https://www.zhipin.com/zhaopin/bc93fb236b750e601HZ93dS0EQ~~/)
- [POSTED] 智谱 "AI Agent 工程师（实习）" 4–9K·15薪; 智谱 "AI 应用开发工程师" 15–25K (3–5 yrs). — [猎聘 智谱](https://www.liepin.com/zpzpaipjo7bw/)
- [POSTED] 月之暗面 Beijing "RL/Agent 实习生" 6–7K (6+ months preferred). — [DataHub 月之暗面](https://datahub.ac.cn/ai-jobs/companies/company-819fc19826.html)
- [POSTED] Sierra "Software Engineer, Agent (New Grad 2027)" and Decagon "Agent Software Engineer – New Grad (Jan 2026)" (pay in Q3). — [Jobright: Sierra New Grad](https://jobright.ai/jobs/info/6a95f517f28891320e85f4e9); [Prosple: Decagon New Grad](https://prosple.com/graduate-employers/decagon/jobs-internships/agent-software-engineer-new-grad)
- Big-tech campus hiring scale: Alibaba's 2026 campus drive plans 7,000+ offers with >60% AI-related (80% at 阿里云, 阿里国际 and 钉钉). ByteDance plans 5,000+ China hires, of which 1,205 of 2,559 campus roles are AI-related. — search summary citing [财联社](https://www.cls.cn/detail/2107582) and [中新网](https://wap.chinanews.com/wap/detail/chs/zw/10645017.shtml)

### Inferences
- **Level-fit assessment for the requester [MY ESTIMATE].** A fresh NYU M.S. who has shipped (1) a production conversational tool-use agent with per-request cost telemetry and 146 tests and (2) a Gemini-based consumer-insight pipeline has relevant evidence for the skills these JDs list: tool calling, production reliability, cost/latency awareness, testing and eval discipline, and multimodal LLM pipelines. That profile is strong for "Agent 工程师 / 大模型应用开发 (校招 SP-tier)" and for Sierra/Decagon-style new-grad agent-engineer roles. It is short of the 5–10-year, team-leading "架构师" bar at large firms and Parloa-style lead roles. The likely missing pieces are high-concurrency distributed systems at scale, multi-tenant enterprise integrations, voice-stack depth, and having owned an eval/regression framework across many customers.
- At a seed–Series A startup like Jekka, an "Agent 架构师" title offered to a new grad is plausible but would likely mean "core or founding agent engineer with architecture ownership". The candidate should ask: who they report to, whether there is a more senior architect or CTO above them, team size, whether the scope is the platform or per-customer deployment, and whether voice is in scope.
- The 猎聘 × 清华 finding that entry-level agent demand fell after Q3 2025 while expert demand rose suggests employers pay premiums for demonstrated production experience. Shipped systems with telemetry and tests are therefore the strongest differentiator a new grad can show. This is my reading of the finding, not a claim the report makes.

### Gaps
- No source quantified what share of "Agent 架构师" postings accept new grads or under 3 years.
- 牛客 offer-爆料 threads and OfferShow data for agent-specific 2026届 offers could not be accessed directly (nowcoder blocked). Only secondary articles were found (see Q3).
- Education distribution (bachelor's vs master's share) for agent-architect postings was not found.

---

## Q3. Compensation ranges by city and level (2025–2026), equity norms at early-stage startups

### Takeaway
**China (posted):** architect-titled Agent roles in Tier-1 cities and Hangzhou commonly post **40–100K/month × 13–18 months**, roughly ¥0.5M–1.8M cash per year [MY ESTIMATE from posted ranges]. The Shanghai 塔斯汀 senior AI application architect (Agent) posting at **20–40K×14** shows the low end. Mid-level agent engineers at model labs post **25–60K/month**. 2026届 new-grad agent and LLM-application roles post around **18–30K×15** at mid-size firms. Secondary-source reports put big-tech "白菜" packages at **¥350–480K** with SP ≥ ¥600K (self-reported or unverified). **US:** agent-engineer base pay at Sierra and Decagon runs **$180–400K**, new grad **$150–180K** base plus equity. Parloa's Lead AI Agent Architect posted **$150–200K + equity**. **Singapore and Hong Kong** pay substantially less than the US: AI-engineer median total comp is about SGD 93K and HK$372K on Levels.fyi. **Equity:** Carta-based data puts the first engineering hires at about 1–2%, falling to about 0.5% by hire #5 and lower after Series A. Chinese-language guidance (mostly older) cites 0.25–3% for early employees and about 0.27% for a mid-level engineer joining pre-A.

### Cited Findings

**China: posted ranges for architect-titled agent roles [POSTED; most are 猎聘 or BOSS snippets with "2026" page labels and no exact posting date]**

| City | Title / employer | Posted range | Experience | Source |
|---|---|---|---|---|
| Beijing | Agent 架构师, listed internet co. | 70–100K·18薪 | 5–10 yrs | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/) |
| Shenzhen (福田) | Agent 架构师 | 70–100K·15薪 | 5+ yrs | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/) |
| Shenzhen | Agent 架构师 (Harness 方向) | 40–60K·14薪 | — | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/) |
| (Tencent FiT) | Agent 架构师, 金融科技 | 90–120K·16薪 | — | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/) |
| Shenzhen 坪山 etc. | Agent 平台架构师 (BYD-related) | "180–220k" (unit ambiguous in snippet; flag) | 5–10 yrs | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/) |
| Shanghai | 高级 AI 应用架构师（Agent 方向）, 塔斯汀 | 20–40K·14薪 | not visible | [V2EX](https://www.v2ex.com/t/1217892) |
| Hangzhou (西湖) | 资深 AI 智能体架构/开发专家 (listed pharma, headhunter) | 40–70K·13薪 | 5–10 yrs | [猎聘 杭州](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/) |
| Hangzhou | 弹性计算 Agent 解决方案架构师 (large internet co.) | 40–70K·16薪 | 5–10 yrs | [猎聘 杭州](https://www.liepin.com/city-hz/zpxfzjjfajgsh18h/) |
| Hangzhou | AI 架构师 | 50–70K·14薪 | 7+ yrs | [猎聘 杭州 架构师](https://www.liepin.com/city-hz/career/360321/) |
| Hangzhou (余杭) | 大模型产品解决方案架构师 | 55–85K·20薪 | 5–10 yrs | [猎聘 杭州](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/) |
| Hangzhou | AI 模型架构师 | 55–85K·13薪 | 1–3 yrs, master's | [猎聘 杭州](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/) |
| Hangzhou | LLM 智能体开发 (quant firm, outlier) | 60–90K·30薪 | not required | [猎聘 杭州](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/) |

**China: posted ranges for engineer-level agent / LLM-application roles [POSTED]**
- MiniMax Shanghai AI 服务端工程师（Agent 方向）: 40–60K (2026-07-17). — [猎聘](https://www.liepin.com/job/1984221441.shtml)
- MiniMax Shanghai AI 全栈工程师（Agent 方向）: 35–55K. Moonshot Shanghai Agent 全栈工程师: 25–50K (2026-05-08). — [DataHub MiniMax](https://datahub.ac.cn/ai-jobs/topics/minimax-jobs.html); [DataHub 月之暗面](https://datahub.ac.cn/ai-jobs/companies/company-819fc19826.html)
- 智谱 AI 应用开发工程师 15–25K (3–5 yrs). — [猎聘 智谱](https://www.liepin.com/zpzpaipjo7bw/)
- Shanghai Agent/全栈 (startup): 30–60K, 13–15 months. Beijing/Shanghai biomed "资深 AI 全栈工程师 (LLM/RAG/Agent)": 35–55K. — [V2EX 上海 Agent/全栈](https://www.v2ex.com/t/1248181); [V2EX 生物医药 AI](https://www.v2ex.com/t/1227866)
- Hangzhou AI 服务端开发 30–60K·16薪; Hangzhou AI 应用工程师 15–30K·14薪. — [BOSS直聘 杭州](https://www.zhipin.com/zhaopin/bc93fb236b750e601HZ93dS0EQ~~/)

**China: new-grad (2026届) figures**
- [POSTED] 钛动科技 2026 校招 Agent 开发工程师, 18–30K·15薪 (Guangzhou/Beijing/Hangzhou). — [牛客](https://www.nowcoder.com/jobs/detail/441167?urlSource=sitemap)
- [PLATFORM-AGG, 前程无忧 2026届校招 AI 人才需求报告, 2025-08] 大模型算法工程师 campus **median 24,760 RMB/month**. The widely quoted 52K/month is the peak for "90-point" candidates, not the median. AI test engineers' median is about 13,621. — [神州学人网](http://www.chisa.edu.cn/bussiness/202508/t20250826_2111382322.html); [阿里云开发者社区 summary](https://developer.aliyun.com/article/1744148)
- [SELF-REPORTED / unverified secondary article] 2026届 大模型应用开发 master's "白菜" packages about **¥350–480K** total (excluding signing bonus), some SP at **¥600K+**. Sample source not stated. — [霍格沃兹/CSDN: 2026校招技术岗薪资大盘点](https://gitcode.csdn.net/6a06e78310ee7a33f272cf79.html); see also [programmercarl 2026届薪资报告](https://programmercarl.com/other/2025salary.html) (not fetchable)
- [SELF-REPORTED anecdote] A Tsinghua master's said several internet firms offered **¥1M+** packages for LLM-algorithm roles. This is an outlier and algorithm-track, not application-track. — search summary citing [中新网](https://wap.chinanews.com/wap/detail/chs/zw/10645017.shtml)
- [PLATFORM-AGG, 脉脉 AI 人才流动报告, Jan–Jul 2025] "More than half of new-grad AI postings advertised >50K/month; 14.68% advertised >80K. 25.27% of AI internships paid >10K/month." These are posted AI-role figures on 脉脉, skewed toward algorithm and research roles. — [中国日报网](https://cn.chinadaily.com.cn/a/202509/18/WS68cbb97aa310f072577492b3.html)
- [3P] One 2026 hot-jobs article gives an AI Agent 开发工程师 monthly median of about 35K (range 15–55K) without separating campus from experienced hires. — [知乎: 2026年AI大模型热门岗位分析报告](https://zhuanlan.zhihu.com/p/2068461420098884756) (low reliability)

**China: platform-wide AI pay aggregates [PLATFORM-AGG]**
- 脉脉 (Jan–Jul 2025): average posted monthly pay for new AI roles **61,475 RMB** (vs 58,921 a year earlier, +4.33%). Average posted pay for new roles by company: Microsoft 90,345, 平头哥 89,760; JD, BYD, Huawei and Xiaomi cluster at 65–68K. — [中国日报网](https://cn.chinadaily.com.cn/a/202509/18/WS68cbb97aa310f072577492b3.html)
- 脉脉 2025 年度人才迁徙报告 (Jan–Oct 2025): AI 科学家/负责人 average **127,225/month**; 大模型算法 **71,060/month**. AIGC algorithm engineers earn about 18% more than regular algorithm engineers. — [每日经济新闻](https://www.nbd.com.cn/articles/2025-12-13/4179991.html); [新华网](http://www.news.cn/tech/20251215/db15c57301044b78b55b9d4c30a4e93b/c.html)
- 猎聘 2025 年度人才供需趋势报告 (published about 2026-02): jobs requiring AI skills post average annual pay **¥78K higher**. **30.9%** of AI technical roles post ≥¥500K/year. — [CSDN 转载](https://www.csdn.net/article/2026-02-05/157772002); [搜狐](https://www.sohu.com/a/985403780_121778725)
- BOSS直聘《2026人才趋势报告》(2026-01-22): the AI-role pay premium fell from **3.3× (2022) to 2.6× (2025)**, attributed to diffusion. AI-engineer median pay rose **15.8%**. — [新浪财经](https://finance.sina.com.cn/stock/t/2026-01-23/doc-inhihnix5030139.shtml); [东方财富](https://wap.eastmoney.com/a/202601233628783624.html)
- 智联: average posted monthly pay for AI engineers **21,319** (2025 spring hiring, secondary citation). Algorithm engineers **25,236** (Q4 2025). — [CSDN citing 智联](https://blog.csdn.net/weixin_44059661/article/details/146171912); [中新经纬](https://www.jwview.com/jingwei/01-14/654208.shtml)
- Note: 智联/前程无忧 averages (about 20–25K) are far below 脉脉 (about 61K) because 脉脉 skews toward big tech and senior AI roles. The sources measure different populations.

**China: secondary or estimated architect pay [3P, low reliability]**
- An industry article estimates Tier-1 agent architects at 35–80K/month, with senior or team-lead architects possibly exceeding ¥1.2M/year. No source is given. — [实在智能](https://www.ai-indeed.com/encyclopedia/18473.html)
- A CSDN post claims a median of ¥920K/year for engineers with agent skills and a "+65%" pay bump. No verifiable data. **Do not rely on it.** — [CSDN](https://blog.csdn.net/cainiao080605/article/details/148804485)

**US [mix of POSTED and SELF-REPORTED]**
- [POSTED] Sierra "Software Engineer, Agent" base **$180K–$390K** (posting dated 2025-04-18 per structured data). Specialist agent tracks $230K–$390K. **New-grad band $150K–$180K** (per Aced). Levels-derived TC median about $460K is an estimate; Sierra does not publish TC. — [Sierra Ashby](https://jobs.ashbyhq.com/Sierra/e9f5fdb6-91ee-4c55-9230-41ec8865650e); [Aced: Sierra FDE](https://www.aced.io/jobs/fde/sierra)
- [POSTED-AGG] Sierra median posted base about **$245K** ($213K–$285K) across 103 public postings (2025–2026). "Software Engineer, Agent Runtime" $230K–$390K. — [Recruiting From Scratch](https://www.recruitingfromscratch.com/roles/sierra-ai-salary)
- [POSTED] Decagon "Agent Software Engineer – New Grad (Jan 2026)": **$180,000/yr + equity**. Decagon "Senior Software Engineer, Agent Orchestration": **$200K–$400K**. — [Prosple](https://prosple.com/graduate-employers/decagon/jobs-internships/agent-software-engineer-new-grad); [Indeed](https://www.indeed.com/q-agent-software-engineer-decagon-jobs.html)
- [POSTED, aggregator] Parloa Lead AI Agent Architect (New York): **$150K–$200K/yr + equity**; posting now closed. — [General Catalyst jobs](https://jobs.generalcatalyst.com/companies/parloa/jobs/71585669-lead-ai-agent-architect)
- [SELF-REPORTED, Levels.fyi, updated 2026-10-14] US Forward Deployed Engineer TC median **$225K** (p25 $175K, p75 $321K, p90 $380K). Palantir FDE median $255K (range $201K–$620K, n=222). Google FDE L4 $301K – L6 $530K (n=17). — [Levels.fyi FDE US](https://www.levels.fyi/t/software-engineer/title/forward-deployed-engineer/locations/united-states); [Palantir FDE](https://www.levels.fyi/companies/palantir/salaries/software-engineer/title/forward-deployed-engineer); [Google FDE](https://www.levels.fyi/companies/google/salaries/software-engineer/title/forward-deployed-engineer)
- [POSTED-AGG] AgenticCareers: median advertised range for "AI Agent Engineer" **$181K–$260K** (34 listings, Sep 2026). — [AgenticCareers data](https://agenticcareers.co/data/salaries/ai-agent-engineer)
- [SELF-REPORTED] PolyAI Software Engineer total pay about $140K–$220K on Glassdoor (small n). Levels.fyi shows a much lower UK median, so the sources conflict. — [Glassdoor PolyAI](https://www.glassdoor.com/Salary/PolyAI-Salaries-E2360836.htm); [Levels.fyi PolyAI](https://www.levels.fyi/companies/polyai/salaries/software-engineer)
- [3P] Third-party "AI Agent Architect" estimates of $250K–$300K+ or $260K–$420K base are unsourced and skew to frontier companies. — [theaicareerlab](https://theaicareerlab.com/blog/agentic-ai-jobs-guide-2026); [theaijournal](https://theaijournal.co/2026/03/agentic-ai-jobs/)
- No Levels.fyi entry for "AI Solutions Architect" was found.

**Singapore [SELF-REPORTED / recruiter]**
- Levels.fyi AI Engineer (Singapore): median TC **SGD 92,782/yr** (p25–p90 SGD 69.5K–182K). — [Levels.fyi SG](https://www.levels.fyi/t/software-engineer/title/ai-engineer/locations/singapore)
- Glassdoor: SGD 5K–9K/month, median about SGD 6K. — [Glassdoor SG](https://www.glassdoor.com/Salaries/singapore-ai-engineer-salary-SRCH_IL.0,9_IC3235921_KO10,21.htm)
- BGC Group (recruiter): fresh grads **SGD 3,500–5,000/month**; 1–2 yrs SGD 5,000–7,000; 3–5 yrs SGD 7,000–10,000+. — [BGC Group](https://bgc-group.com/blogs/starting-as-an-ai-engineer-in-singapore/)
- SkillUp estimate: SGD 5,400–18,300/month, median about SGD 8,800–10,000. — [SkillUp](https://www.skillup.sg/blog/ai-ml-engineer-salary-singapore)
- No MyCareersFuture posted ranges for agent/LLM roles were surfaced.

**Hong Kong [SELF-REPORTED / modeled]**
- Levels.fyi AI Engineer (HK SAR): median TC **HK$371,813/yr**. — [Levels.fyi HK](https://www.levels.fyi/t/software-engineer/title/ai-engineer/locations/hong-kong-sar)
- ERI SalaryExpert (modeled, Dec 2025): average **HK$726,705** (range HK$500,699–887,306). Entry level (1–3 yrs) about HK$508,309. — [ERI](https://www.erieri.com/salary/job/artificial-intelligence-engineer/hong-kong-sar); [SalaryExpert](https://www.salaryexpert.com/salary/job/engineer-artificial-intelligence/hong-kong-sar)
- Glassdoor: HK$26K–42K/month (n=15, Nov 2025). — [Glassdoor HK](https://www.glassdoor.com/Salaries/hong-kong-ai-engineer-salary-SRCH_IL.0,9_IC2308631_KO10,21.htm)
- Levels.fyi and ERI differ by about 2×. Treat this as unresolved.

**Equity norms at early-stage startups**
- [Carta-derived, secondary] Median grant for the **first hire about 1%**, declining rapidly afterward. — [Mucker: Carta benchmarks](https://mucker.com/blog/compensation-benchmarks-early-stage-startups-from-carta/)
- [Carta-derived, 2025] First employee typically **1.54%**, falling to **0.48% by the fifth hire**. — [OnHealthcare: 2025 playbook citing Carta](https://www.onhealthcare.tech/p/the-2025-playbook-for-early-stage)
- [Carta/Holloway-derived guide] Engineers #1–3: **1.0–2.0%**. Senior engineers #4–10: **0.5–1.0%** (assumes a 10–15% pool). First hires get **4–8×** the grant of post-Series-A engineers. Typical option pools are 10–20%. — [Startup Science](https://www.startupscience.io/articles/startup-employee-equity); [CandorIQ](https://www.candoriq.com/blog/startup-compensation-equity-guide)
- [Carta, 2026] Founders hold about 56% median at seed and about 36% after Series A. Median Series A dilution is about 18.7% (Q2 2026). — [Carta Founder Ownership Report 2026](https://carta.com/data/founder-ownership-2026/); [Carta Series A](https://carta.com/learn/startups/fundraising/series-a/)
- [China, mostly older (about 2018) guidance; flag as dated] Early employees 0.25–3%. Pre-angel promises of 1–3% roughly halve after A and halve again after B. A mid-level engineer joining pre-A gets about 0.27%. One case went from 1% after seed to 0.6% after A. Pools are usually 10–15% early on. Exercise price at Series A is often 10–30% of that round's per-share price. — [知乎: 一般的创业公司给员工的股权激励](https://www.zhihu.com/question/19722630); [知乎: 去创业公司如何谈期权](https://www.zhihu.com/question/20495836); [36氪: 天使轮到C轮股权激励12条建议](https://www.36kr.com/p/685728081924737); [36氪: 股权稀释](https://36kr.com/p/1721216696321)
- [China AI, 2025–2026] MiniMax reportedly grants options even to part-time expert hires, "following overseas practice". ByteDance Seed offers eligible new grads "豆包股". — [第一财经](https://www.yicai.com/news/103178255.html); search summary citing [雷锋网](https://www.leiphone.com/category/industrynews/ZMIJxUutAtwnKQVD.html)

### Inferences
- **Annualized cash from posted ranges [MY ESTIMATE; monthly × months, before tax, assuming the full month count is paid]:**
  - Beijing Agent 架构师 70–100K×18 ≈ **¥1.26M–1.80M**; Shenzhen 70–100K×15 ≈ ¥1.05M–1.50M; Tencent FiT 90–120K×16 ≈ ¥1.44M–1.92M.
  - Hangzhou architect-titled: 40–70K×13 ≈ ¥0.52M–0.91M; 40–70K×16 ≈ ¥0.64M–1.12M; 50–70K×14 ≈ ¥0.70M–0.98M; 55–85K×20 ≈ ¥1.10M–1.70M.
  - Shanghai 塔斯汀 20–40K×14 ≈ ¥0.28M–0.56M (low end for an "architect" title).
  - Mid-level agent engineers at model labs (25–60K, months unknown; assume 13–16) ≈ ¥0.33M–0.96M.
  - New-grad Agent 开发 18–30K×15 ≈ ¥0.27M–0.45M, consistent with the secondary "白菜 ¥350–480K" figure.
  - Posted ranges usually anchor offers in the lower-to-middle part of the band. Big-tech month counts (16–18) include performance bonuses that are not guaranteed.
- **City pattern [MY ESTIMATE].** In this sample, Hangzhou architect postings cluster at about 40–85K/month, overlapping Shanghai and Shenzhen but below the Beijing and Shenzhen big-tech 70–120K bands. 脉脉 reports Hangzhou's AI-posting penetration (28.54%) above Shanghai's and Shenzhen's, so Hangzhou AI demand is strong even if headline pay trails Beijing. The sample is too small for a robust city ranking.
- **Plausible Jekka band (seed-to-A, Hangzhou) [MY ESTIMATE, not sourced].** For a new-grad or junior hire carrying an "Agent 架构师" title: roughly 25–45K × 13–15 (≈ ¥0.33M–0.68M cash) plus options. For a senior (5+ years) hire: roughly 50–80K × 13–15 (≈ ¥0.65M–1.2M) plus options. Startups often pay below big-tech cash and compensate with equity.
- **Equity for a startup hire [MY ESTIMATE].** If Jekka is at seed/Series A and the candidate is roughly within the first 10–30 engineers, Carta-style norms imply about 0.1–0.5% (more if a true founding-architect hire). Chinese startups commonly grant options through an offshore (Cayman/VIE) plan or onshore partnership-held shares (持股平台). Jekka's Wilmington (Delaware) entity suggests a USD structure is possible, but this is unverified. Key negotiation points: share count against fully diluted shares, strike price, vesting (typically 4 years with a 1-year cliff), exercise window after leaving, and buyback terms.
- **FX for comparison [MY ESTIMATE; approximate 2025–2026 rates, not sourced]:** USD 1 ≈ CNY 7.1–7.2; SGD 1 ≈ CNY 5.4–5.6; HKD 1 ≈ CNY 0.91–0.92. On these rates, Singapore's AI-engineer median TC of SGD 93K ≈ ¥0.5M and Hong Kong's Levels.fyi median of HK$372K ≈ ¥0.34M. Both are comparable to or below Hangzhou senior-engineer posted cash. US new-grad agent-engineer base of $150–180K ≈ ¥1.07M–1.30M before equity.

### Gaps
- No verified offer-level data (OfferShow, 牛客 爆料) specific to "Agent 架构师" or agent startups in Hangzhou. Network blocks prevented direct access.
- The BYD-related "180–220k" figure's unit (monthly, annual or typo) could not be verified.
- No posted Singapore or Hong Kong ranges for agent-specific roles. Only general AI-engineer aggregates were found.
- No 2025–2026 China-specific data on employee option percentages at AI startups. Available Chinese equity guidance is about 2018 vintage.
- No salary data found for 晓多, 乐言, 智齿, 网易七鱼, 容联七陌 or 中关村科金 agent roles.
- Intercom Fin agent-role pay was not found.

---

## Q4. 2025–2026 hiring trends for agent roles in China (demand growth, salary premiums, most-requested skills)

### Takeaway
AI hiring in China grew sharply through 2025 and into 2026. BOSS直聘 reports AI-related monthly new postings up 74% in 2025. 脉脉 reports new AI postings up 543% for Jan–Oct 2025 and 8.7× for Jan–Apr 2026. 猎聘 × 清华 report agent-talent demand up about 40%, with demand shifting toward expert and leader levels after Q3 2025. The AI pay premium remains large but is compressing (BOSS: 3.3× → 2.6×). The most-requested agent skills are Python, LangChain/LangGraph/Dify/Coze-style frameworks, RAG, tool/function calling, multi-agent orchestration, and increasingly MCP, context engineering and evaluation. Quantified skill-share data is weak.

### Cited Findings
- [PLATFORM-AGG] BOSS直聘《2026人才趋势报告》(2026-01-22): 2025 AI-related monthly new postings **+74% YoY**. AI-engineer demand +317% and median pay +15.8%. AI pay premium **3.3× (2022) → 2.6× (2025)**. AI postings in professional-services industries grew more than 200%. — [北京商报](https://m.bbtnews.com.cn/article/218079); [东方财富](https://wap.eastmoney.com/a/202601233628783624.html); [腾讯新闻](https://news.qq.com/rain/a/20260123A050W300)
- [PLATFORM-AGG] 脉脉: AI new postings **10×+ YoY** and resume submissions 11× for Jan–Jul 2025. AI new postings **+543%** for Jan–Oct 2025. AI PM postings +369%. For Jan–Apr 2026, AI postings were **8.7× YoY** and embodied AI 15×. Hangzhou's AI-posting penetration was **28.54%**, second only to Beijing (30.17%) and ahead of Shanghai (24.31%) and Shenzhen (19.22%). — [中国日报网](https://cn.chinadaily.com.cn/a/202509/18/WS68cbb97aa310f072577492b3.html); [新浪科技 2025-12-12](https://finance.sina.com.cn/tech/roll/2025-12-12/doc-inhaprxi5698237.shtml); [新浪财经 2026-05-13](https://finance.sina.com.cn/tob/2026-05-13/doc-inhxufve9196285.shtml); [新浪财经 2026-05-14](https://finance.sina.com.cn/stock/t/2026-05-14/doc-inhxvpqt4083058.shtml)
- [PLATFORM-AGG] 猎聘 × 清华 (2026-06): agent-talent demand **+40%**. From Q3 2025, entry and intermediate demand fell while expert and leader demand grew. — [腾讯新闻](https://view.inews.qq.com/a/20260618A04X5K00?scene=news-skill) (snippet only)
- [PLATFORM-AGG] 猎聘 2025 annual report: the AI industry led new-posting growth at **+43.1%**. Demand for AI-minded management talent rose 281.6% and demand for AI-enabled applied talent rose more than 160%. AI technical talent tightness index (TSI) was 2.30 in H1 2025. — [CSDN 转载 猎聘年度报告](https://www.csdn.net/article/2026-02-05/157772002); [搜狐](https://www.sohu.com/a/985403780_121778725)
- [PLATFORM-AGG] 智联 2025 AI industry talent report: Q3 2025 AI-industry postings +11% YoY while job seekers +23%. AI PM demand +178%. SMEs account for more than 80% of AI-industry hiring. Algorithm-engineer postings +110.1% in Q4 2025. — [21经济网](https://www.21jingji.com/article/20251024/herald/99f5deac46722328df0354104c860ed0.html); [中新经纬](https://www.jwview.com/jingwei/01-14/654208.shtml)
- [PLATFORM-AGG] Salary premiums: 脉脉 reports AIGC algorithm engineers earn about 18% more than general algorithm engineers and AI PMs about 20% more than general PMs. 猎聘 reports AI-skill jobs post +¥78K/yr. — [每日经济新闻](https://www.nbd.com.cn/articles/2025-12-13/4179991.html); [CSDN 转载 猎聘](https://www.csdn.net/article/2026-02-05/157772002)
- [3P, low reliability] A CSDN JD sample of 320+ postings: Python about 95%, LangChain/Dify/Coze about 70%, RAG about 65%, fine-tuning about 55%. The author admits it is a non-representative sample. — search summary of [CSDN/devpress 就业真相](https://devpress.csdn.net/awstech/6a91c2d93bda720d4b355f41.html)
- [3P] A DeepSeek hiring analysis claims about 80% of 36 DeepSeek postings mention "Agent", with MCP among keywords and code-agent JDs listing tool-call accuracy and instruction-following as eval dimensions. This is a single-company sample. — [技术派](https://paicoding.com/deepseek-hiring-ai-era); [ADG/CSDN](https://adg.csdn.net/6a41f0c6662f9a54cb857b03.html)
- [3P] Claims such as "Agent 工程师爆增310%" or "AI Agent 开发需求增长244%" circulate without methodology. Treat as unverified. — [AtomGit/CSDN](https://gitcode.csdn.net/6a046d420a2f6a37c5a9d4c2.html); [知乎](https://zhuanlan.zhihu.com/p/2068461420098884756)
- [3P] Many JDs now ask for familiarity with AI coding tools (Cursor, Claude Code), and newer postings feature "Context Engineering" and "Agent Skill / Harness" language. — [V2EX 塔斯汀](https://www.v2ex.com/t/1217892); [Randstad: Agent Harness 架构师](https://www.randstad.cn/jobs/agent-harnessjia-gou-shi_shenzhen_90M0151014_18823_CN/)
- [Big-tech campus] Alibaba 2026 campus: 7,000+ offers with >60% AI. ByteDance: 1,205 of 2,559 campus roles AI-related. Baidu says more than 90% of its 2026 campus roles are AI, with 4,000+ offers. — search summaries citing [财联社](https://www.cls.cn/detail/2107582) and [黑马程序员](https://www.itheima.com/news/20260513/164242.html)

### Inferences
- Demand for agent builders is real and growing in 2025–2026, and Hangzhou is a top-two AI hiring city by penetration. However, the market is bifurcating: senior and expert agent talent commands the architect bands, while generic "AI application" roles are being commoditized (the BOSS premium compression and the 猎聘 entry-level decline both point this way). A candidate who can show production evidence (telemetry, tests, cost control, eval) sits closer to the scarce end.
- For Jekka specifically, the market signals suggest it competes for agent talent against Hangzhou big tech (阿里云, 钉钉, 淘天) and well-funded labs paying 40–85K/month. A seed/A startup would typically pay below that on cash and use equity and title (for example "架构师") as levers. That makes it important to clarify the actual scope and level behind the title.

### Gaps
- No platform report isolates "Agent 工程师 / Agent 架构师" as a job category with its own growth rate or pay statistics. All official figures are broad "AI" categories.
- No rigorous, methodology-disclosed skill-frequency study (RAG / MCP / multi-agent / eval / voice / fine-tuning shares) for Chinese agent JDs was found.
- No data on voice-agent-specific hiring demand (ASR/TTS/latency) in China.
