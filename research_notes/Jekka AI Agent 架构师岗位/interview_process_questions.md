# Interview process and common questions for Agent 架构师 / LLM-agent engineering roles (prep for Jekka AI)

**Method and reliability note for the report writer (researched 2026-10-16):**
- The network policy blocked full-page fetches from almost every Chinese source: nowcoder.com, zhihu.com, csdn.net, juejin.cn, segmentfault.com, linux.do, mianlingai.com, kamacoder.com, github.io pages, 163.com, podwise.ai, jekka.ai, decagon.ai and sierra.ai. All returned DNS failure or an HTTP 403 from the proxy. I did not try to get around the block.
- Pages on github.com did load: datawhalechina/hello-agents, adongwanai/AgentGuide, Zchary1106/agent-interview-hub, BigKunLun/agent-interview-100 and ChiyuSONG/inside-jev.
- Everything else comes from **search-engine result summaries and snippets**. Snippet wording may be paraphrased, so check the page before quoting anything word for word.
- Facts about Jekka's company, products and founder reuse the sibling notes in `research_notes/Jekka AI 公司调研/` where marked. Those notes were built under the same constraints.
- Labels used below:
  - **[面经]**: a first-person interview report.
  - **[题库]**: an aggregated question bank or compilation. Its company tags are unverified.
  - **[advice]**: generic advice or vendor engineering material.
  - Dates come from the page, title or snippet. "Undated" means the snippet did not show a date.

---

## Q1. What interview processes and question types are reported for Agent 架构师 / AI Agent 工程师 / 大模型应用开发 roles at Chinese startups and big tech in 2025–2026?

### Takeaway
Reported processes run **2–4 technical rounds plus HR**, and the project deep-dive (项目深挖) dominates every round.
- At big tech, round 1 is often fundamentals (backend 八股 and sometimes an algorithm problem). Round 2 covers Agent and RAG design and system design. Round 3 tests breadth, vision and career fit.
- At startups the process is shorter, usually about 3 rounds. One of them is a **CEO/founder conversation** about hands-on AI practice. A **small runnable take-home** (often "vibe-coding" allowed) is common, and there is no standard written test.
- 2026 reports say pure memorization (背八股) matters less. Interviewers point at a node in your architecture diagram and ask about failure handling, trade-offs and quantified results.

### Cited Findings
**Process and structure**
- **[面经] Alibaba, c. 2025–26, via an aggregator summary:** "一面偏基础：Java 八股 + Redis + MySQL + 分布式（即使是 Agent 岗）；二面偏 AI：Agent 设计、RAG、项目深挖". The compiler recommends focusing on three blocks, Agent + RAG + LLM tool calling, because they cover most round-1 and round-2 follow-ups. — [kamacoder 2026 大模型面经汇总](https://notes.kamacoder.com/interview/llm/); [小林coding 2026 AI 大模型面试题](https://www.xiaolincoding.com/project/xiaolinnote.html)
- **[面经] Baidu 文心一言 team, Agent role, three rounds, c. 2025.** The rounds escalate: round 1 is fundamentals (基础八股), round 2 is thinking style and hands-on experience (思维方式与实践经验), and round 3 is big-picture view and career planning (全局视野与职业规划). — [知乎: 文心一言团队大模型 Agent 岗面经（三面全记录）](https://zhuanlan.zhihu.com/p/1946655041625760922)
- **[面经] Experienced hire with 5 years, 大模型应用开发, c. 2025.**
  - The candidate interviewed at 20+ companies in about six months, including Alibaba, Tencent, Meituan and ByteDance.
  - Round 1 was often run by the **team leader** and built around the candidate's project, with less 八股 than before ("但仍不能忽视").
  - Candidates who had **done hands-on fine-tuning** reportedly passed more often.
  - Target roles included game-industry LLM apps, toC personal assistants and toB solutions.
  
  — [知乎: 大模型应用开发面经（5年经验）](https://zhuanlan.zhihu.com/p/1928735725647562675); [牛客 repost](https://www.nowcoder.com/feed/main/detail/129eaa1c20444651ac3b932e200d3da4)
- **[面经] Tencent AI-application backend intern, plus Baidu, compiled "04/28" (year not shown in snippet).** Topics were a project deep-dive, multi-agent orchestration, failure retry and **hot-updating a RAG knowledge base**. A coding question was included. — [牛客: 大模型、Agent面经总结【04/28】腾讯 / 百度](https://www.nowcoder.com/discuss/878600528970735616)
- **[面经] 2026: four Agent roles at NetEase, Alibaba, Tencent and ByteDance.** The title's thesis is "2026年的面试确实不背八股了" (in 2026 interviews really aren't about memorized 八股 any more). Full text was blocked. — [掘金 7675928689989222440](https://juejin.cn/post/7675928689989222440)
- **[面经] 2026, from the article title: "AI Agent 岗面试复盘：拿到三个offer"** (three offers).
  - The process was three rounds, and **round 3 was divergent**, covering the candidate's view of the future of AI Agents.
  - The interviewer probed a real design change: starting with CoT for knowledge-base QA, finding that complex questions decomposed poorly, then switching to ReAct.
  
  — [SegmentFault 1190000047697204](https://segmentfault.com/a/1190000047697204)
- **[面经] Startup example, undated, V2EX.** This was a deep-research subsidiary of 盛大 (Shanda), for an agent/full-stack role.
  - The process was **three rounds**, and **round 2 was HR plus CEO**, "聊的全是 AI 实战" (all about real AI practice).
  - The coding task was to use vibe-coding to adapt an open-source project so it runs locally.
  - The author's lesson: interviewers keep asking "why", and anything copied from AI output or someone else's design gets exposed.
  
  — [V2EX t/1218676](https://www.v2ex.com/t/1218676)
- **[面经] 2026: social-hire Agent interviews in April–May.** The author came from a Java-backend background. Full text was blocked. — [LINUX DO t/2416951](https://linux.do/t/topic/2416951)
- **[advice/roundup] 2025–2026 China LLM hiring roundup:** many companies show "未见统一笔试证据" (no evidence of a standard written test). Where coding signals exist they are algorithm problems plus scenario design, and the evidence comes from big tech, not startups. — [keepkeen: 2025—2026 国内大模型算法岗招聘、面经与笔试汇总](https://keepkeen.github.io/blog/llm-recruit-interview-roundup/)
- **[题库] agent-interview-hub on GitHub, 2026 docs.**
  - It collects 岗位要求 (job requirements), questions and real 面经 for Alibaba, ByteDance, Xiaohongshu, Meituan, Ant, Huawei and Kuaishou, plus OpenAI and Anthropic. Startups have requirements and questions, but **no real 面经**.
  - It lists **timed practice take-homes of 1–2 h up to 4–6 h**: "智能文档问答 Agent", "AI 调试挑战" and "AI Code Review Agent".
  - Its live-coding (手撕) list covers Attention, LoRA, retrieval, RRF, tool-argument validation and writing an Agent Loop.
  - It has a "harness release-gate" doc covering three-layer grading, Shadow and Canary.
  
  — [GitHub Zchary1106/agent-interview-hub](https://github.com/Zchary1106/agent-interview-hub)
- **[题库] datawhalechina/hello-agents "面试问题总结", 2025 autumn campus recruitment, mainly Chinese internet companies.**
  - It has 92 questions in 8 sections: LLM 16, VLM 11, RLHF 13, Agent 13, RAG 12, Evaluation 10, Outlook 9, Misc 8.
  - Target roles: LLM algorithm engineer, Agent engineer, AI development engineer and **evaluation engineer**.
  - Examples from the Agent and Eval sections:
    - "Why is agent evaluation harder than LLM evaluation, and along what dimensions?"
    - "Process metrics beyond final correctness (efficiency, cost, robustness)"
    - "Monitoring deployed LLM apps/agents for regression and behavior drift"
    - "LLM-as-a-Judge advantages and biases"
    - "Designing human-evaluation criteria for consistency"
    - "Have you fine-tuned agent capabilities, and how was data collected?"
    - "The A2A framework and how it differs"
  - Misc examples: "biggest bottleneck limiting agent adoption" and "core qualities of a top AI agent engineer".
  
  — [GitHub hello-agents Extra01](https://github.com/datawhalechina/hello-agents/blob/main/Extra-Chapter/Extra01-%E9%9D%A2%E8%AF%95%E9%97%AE%E9%A2%98%E6%80%BB%E7%BB%93.md)
- **[题库] AgentGuide on GitHub, © 2026, 204 commits.**
  - It claims "美团/字节/阿里等16个完整案例" (16 complete 面经) and a separate digest of "1000篇小红书AI算法岗面经".
  - Question counts: Agent systems 52, RAG 22, live coding 34, dev-role specials 45 (including system design), model evaluation 10.
  - One dev-role scenario example is "客服部门日均5000+重复工单" (a support department with 5,000+ repetitive tickets a day).
  
  — [GitHub adongwanai/AgentGuide](https://github.com/adongwanai/AgentGuide)

**Question types and interviewing style**
- **[面经-derived] ByteDance, 2026 compilations.**
  - The interviewer holds your architecture diagram and points at one node, for example retry and fallback after a tool call fails.
  - ByteDance is described as the most detail-dense, with high-frequency topics of ReAct details, **tool-call infinite loops** and Coding-Agent architecture.
  - A quoted follow-up: "你的Agent调了三个工具就死循环了，异常处理在哪写的？" (your agent called three tools and went into an infinite loop; where did you write the exception handling?).
  
  — [掘金 7674870309703319567（字节/阿里/腾讯三家 AI Agent 岗真题）](https://juejin.cn/post/7674870309703319567); [CSDN: 2026大厂AI Agent面试全攻略](https://adg.csdn.net/6a82f7fa10ee7a33f29c2607.html)
- **[题库, company-tagged, unverified] ByteDance:**
  - how memory recall avoids cross-question contamination;
  - how to stop malicious instructions in web pages from being injected into an agent;
  - an ops-style system design where a **payment API times out** and the agent must run the full diagnosis while high-risk actions stay controlled.
  
  **Alibaba:**
  - describe the optimizations you made, using **trace breakdown** to locate bottlenecks and quantify the gains;
  - RAG recall problems and hallucination governance;
  - **"AI 客服 Agent 项目如何设计"**, with chunking and embedding choice;
  - Alibaba International: multi-agent context management, and whether summary compression causes "失忆" (memory loss).
  
  — [面灵AI: 155 道大厂真题（2026 面经）](https://www.mianlingai.com/topics/ai-agent-interview-questions-2026/); [AgentGuide](https://github.com/adongwanai/AgentGuide)
- **[面经] Handling tool-call failures and context overflow (c. 2025, CSDN):** answer with parameter validation, failure retry and human fallback (人工兜底). — [CSDN: 最近在面试AI Agent开发工程师！【面经分享】](https://blog.csdn.net/weixin_43958728/article/details/152039160)
- **[面经] ByteDance AI Agent round 1, failed attempt (凉经), 16 questions:** the round covered LLM fundamentals, the business logic of the candidate's agent project, RAG and engineering ability. The write-up says many candidates fail because they cannot explain the project's background, pain points and measured effect. — [CSDN 159677903](https://blog.csdn.net/l01011_/article/details/159677903)

### Inferences
- For a 50–150-person company like Jekka (size from a campus-recruiting profile cited in the sibling notes), the most likely sequence borrows the startup pattern above:
  1. résumé screen or HR call;
  2. one or two technical rounds dominated by a project deep-dive and an agent system-design scenario;
  3. possibly a practical exercise or take-home;
  4. a co-founder or CEO round about real AI practice, judgment and fit;
  5. HR and offer.
  
  This is an inference. No Jekka-specific report exists (see Q4).
- An LLM-theory round (Transformer, RLHF, decoding) is less likely to be the focus for an *architect* role at an application company. Expect some anyway, because Jekka claims its own models ("Jekka-Markov", "Heisenberg"). The hello-agents and Baidu reports show 八股 still appears in round 1.
- Take-home risk: a 1–6 h "build a small agent with evals" task is plausible, as in the agent-interview-hub practice-task format. If one is offered, ship tests and an eval harness with it, which mirrors the founder's test-first emphasis.

### Gaps
- No full-text 面经 could be read from nowcoder, Zhihu, Xiaohongshu or 脉脉 because of the network block. Question lists above come from snippets and summaries.
- No report found for a role titled exactly "Agent 架构师" at a startup. Architect-level content comes only from question banks (see Q2).
- Salary, timelines (days between rounds) and offer-negotiation details for Agent roles were not found in this pass. Pay benchmarking belongs to a sibling task.

---

## Q2. Which system-design and deep-dive questions recur, and what do strong answers include?

### Takeaway
The recurring core is:
- the agent loop (stop conditions, max steps, loop/dead-loop handling, error recovery, human-in-the-loop);
- **workflow vs. autonomous agent** (and single prompt vs. workflow vs. agent);
- function-calling and tool design;
- memory (short/long-term, pollution, compression);
- RAG quality;
- single vs. multi-agent;
- MCP vs. function calling vs. A2A;
- hallucination taxonomy and controls;
- **evaluation** (component, trajectory and end-to-end; golden sets; LLM-as-judge; regression gates);
- latency and cost (routing, caching, compression).

The customer-service agent is a named scenario prompt ("设计一个客服 Agent" / "AI 客服 Agent 项目如何设计"). Strong answers combine an explicit, code-enforced SOP/state layer, ground truth fetched from backend systems, layered guardrails, risk-tiered human handoff, and an eval program that measures **consistency (pass^k) and worst cases**, not just average accuracy.

### Cited Findings
**Recurring deep-dive questions (Chinese 面经 and 题库, 2025–2026)**
- **[面经] 5-year experienced hire:**
  - how long- and short-term memory is stored, at what granularity, and how it is used;
  - how Function Call is implemented;
  - the biggest difficulty and its result;
  - **how latency was optimized**;
  - single-agent vs. multi-agent design comparison;
  - **why use a reflection mechanism**;
  - how retrieval quality and answer quality are measured.
  
  — [知乎 1928735725647562675](https://zhuanlan.zhihu.com/p/1928735725647562675)
- **[面经/题库] Round 2 often turns into system design.**
  - Candidates are asked to design a layered production Agent, then defend framework choices: "某框架的劣势、如果自研怎么优化" (a framework's weaknesses, and how you would optimize if you built your own).
  - Other recurring questions: MCP vs. Function Call, the A2A protocol, **why hand-roll an agent instead of using a framework**, and **Prompt Caching**.
  - Choosing between single prompt, Workflow and Agent, and vertical agents vs. generality.
  - The compilation says Agent is the #1 topic, often posed as "设计一个客服 Agent" with follow-ups on multi-turn dialogue, tool calls and hallucination.
  
  — [kamacoder](https://notes.kamacoder.com/interview/llm/); [面灵AI 265 题 (2026)](https://www.mianlingai.com/topics/llm-agent-interview-questions-2026/); [SegmentFault](https://segmentfault.com/a/1190000047697204)
- **[题库] AgentGuide "面试深水区" (deep-water topics, 2026):**
  - **Agent Loop:** max steps, stop conditions, error recovery, how to design HITL.
  - **Context and cost:** context layering, compression, model routing, reducing token cost.
  - **Tool design:** naming, description, schema, permission tiers, recovering when the wrong tool is chosen.
  - **Memory:** working / episodic / semantic; what to store, how to recall and how to forget.
  - **Evaluation and governance:** component / trajectory / end-to-end evals, where golden datasets come from, trace auditing.
  - **Reliability:** idempotency, timeout, retry, cost guard, permission tier, observability.
  
  — [GitHub AgentGuide](https://github.com/adongwanai/AgentGuide)
- **[题库] "Agent Interview 100", 2026, 11 modules.**
  - Architecture 12, RAG 9, Tool Use 10, Multi-Agent 10, Memory 6, Planning 7, Prompting 10, **Evaluation 9**, Safety 8, **Production 13**, Frameworks 6.
  - Specific items:
    - #007 Workflow vs Agent; #006 agent loop and error recovery; #026 tool failures and timeouts;
    - #082 hallucination detection and mitigation;
    - #073 regression testing; #074 traces and spans; #076 "static benchmark trap"; #077 continuous evaluation; #111 eval-harness design;
    - #088 cost optimization; #089 model routing; #090 latency optimization; #095 disaster recovery and HA;
    - #027 MCP; #101 A2A.
  
  — [GitHub BigKunLun/agent-interview-100](https://github.com/BigKunLun/agent-interview-100)
- **[题库] Architect-level framing (2026, CSDN "AI Agent 应用架构师 & CTO 面试题库").** It leans toward platform capabilities:
  - **scheduling millions of concurrent sessions**;
  - **state persistence and checkpoint/resume for long-running tasks**;
  - permission design for a tool marketplace.
  
  Interviewers reportedly look for three things: "你有没有真做过；你有没有权衡意识；你有没有兜底思维" (have you actually built it; do you think in trade-offs; do you design fallbacks). — [CSDN adg 6a45004810ee7a33f28571fd](https://adg.csdn.net/6a45004810ee7a33f28571fd.html); [博客园 iTech: 40+ 真题](https://www.cnblogs.com/itech/p/20111938); [掘金: AI 工程师面试 10 连问](https://juejin.cn/post/7695952014752284708)
- **[题库] Memory questions:**
  - "请设计一个 Agent 的记忆系统" (design an agent's memory system);
  - "上下文窗口溢出了怎么办" (what do you do when the context window overflows);
  - "长期记忆怎么避免'记忆污染'" (how long-term memory avoids "memory pollution").
  
  Multi-agent questions: when to split into multiple agents, how to prevent deadlock and infinite loops, and the Supervisor / peer-to-peer / hierarchical patterns. — [知乎: 2026大模型智能体(Agent)面试全攻略](https://zhuanlan.zhihu.com/p/1994727642969167003); [知乎: 2026年Agent大厂面试题汇总](https://zhuanlan.zhihu.com/p/2028511483969937686)

**Customer-service scenario questions (Chinese sources)**
- **[题库] A typical prompt: "从 0 到 1 设计智能客服 Agent 并写出完整技术方案"** (design a customer-service agent from scratch and write the full technical plan). Hallucination causes, detection and mitigation are high-frequency follow-ups. — [CSDN agent: 20000 道 AI Agent 面试题大全](https://agent.csdn.net/6a6c715710ee7a33f294da47.html)
- **[题库] Hallucination sub-questions:**
  - **tool hallucination**;
  - **"任务幻觉"** (task hallucination: claiming completion without executing the tool);
  - **how to quantify the hallucination rate**.
  
  — [CSDN agent](https://agent.csdn.net/6a6c715710ee7a33f294da47.html); [小林coding 大模型面试题](https://xiaolinnote.com/ai/)
- **[advice] Hard handoff rules** include repeated unclear intent, sensitive words and an agitated user. High-risk operations such as refunds or account closure should hand off early or run on a **deterministic state machine**, following a risk-tiering principle. — [CSDN damodev: 智能客服Agent全攻略](https://damodev.csdn.net/6985620454b52172bc5a32cc.html)
- **[advice] Retail split:** the AI handles policy/FAQ and order lookups; humans handle large refunds, complaints and legal issues, explicit "talk to a person" requests, and repeated AI failures. — [YoTradeApi: AI 客服自动化工程化方案](https://blog.yotradeapi.com/blog/ai-customer-support-workflow/)
- **[advice] Scenario walkthrough:**
  - decompose the agent into intent recognition, RAG retrieval, order and ticket tools, human transfer and output validation, with takeover when risk is high or confidence is low;
  - define goals and success criteria first, then split into sub-flows (FAQ, order query, refund, complaint escalation, transfer).
  
  — [misaka-9982: 场景题，把 Agent 设计能力落到真实业务](https://www.misaka-9982.com/2023/05/01/agent-series-11-scenarios/) (URL path says 2023; the content's real date is unverified)

**What "strong" looks like: engineering material from customer-service agent companies (for depth calibration)**
- **[advice] Sierra τ-bench, June 2024; follow-ons τ²/τ³.**
  - A simulated user, a domain policy and tool APIs exercise the agent. A task scores 1 only if the **final database state matches what the policy requires**.
  - Version 1 had 165 tasks (115 retail, 50 airline).
  - **pass^k** is the probability of success on *all* k independent trials. GPT-4-class agents solved under 50% of tasks and only about 25% at pass^8, and GPT-4o's retail score fell about 60% from pass^1 to pass^8.
  - Telecom and banking were added later, and the original repo now points to τ³-bench.
  
  — [Sierra blog: benchmarking AI agents](https://sierra.ai/uk/blog/benchmarking-ai-agents); [Sierra blog: τ-bench shaping development](https://sierra.ai/de/blog/tau-bench-shaping-development-evaluation-agents); [layer3labs explainer (updated 2026-09-25)](https://www.layer3labs.io/guides/tau-bench-explained) (numbers came via search summary; check the paper)
- **[advice] Sierra Voice Sims (2025):**
  - each simulation starts from a persona with a goal, mood, language and patience level;
  - the persona's speech is synthesized and mixed with background noise, then run through the production voice loop;
  - **silence, interruptions and overlapping speech** are tracked, so the test covers *when* the agent speaks as well as what it says;
  - latency and error rates are aggregated over time to catch regressions when the agent is upgraded.
  
  A Sierra PM who leads "the Agent SDK, Developer Experience, and the simulation and testing framework" spoke on simulations at MLOps Community on 2025-11-27. — [Sierra: how voice sims work](https://sierra.ai/blog/how-voice-sims-work); [Sierra: voice sims test agents in real-world conditions](https://sierra.ai/blog/voice-sims-test-agents-in-real-world-conditions-before-they-talk-to-your-customers); [MLOps Community talk, 2025-11-27](https://home.mlops.community/home/videos/simulate-to-scale-how-realistic-simulations-power-reliable-agents-in-production-sachi-shah-2025-11-27)
- **[advice] Decagon Agent Operating Procedures (AOPs), 2025:**
  - AOPs combine "the power and flexibility of natural language with the precision and rigor of code";
  - they replace maintenance-heavy decision trees;
  - one workflow is defined once and applied across voice, chat and email;
  - they execute actions end-to-end (refunds, identity verification, subscription updates; Nov 2025 post);
  - an **AOP Copilot** (Sept 2025, later folded into "Duet") helps build and optimize AOPs, and Duet selects the right AOP and follows it.
  
  I found no public deep-dive on how AOPs compile internally. — [Decagon: from SOPs to AOPs](https://decagon.ai/blog/from-sops-to-agent-operating-procedures); [Decagon: why we built AOP](https://decagon.ai/blog/why-we-built-aop); [Decagon: AOP Copilot](https://decagon.ai/blog/aop-copilot); [Decagon: Duet on AOPs](https://decagon.ai/blog/why-we-built-decagon-duet-on-agent-operating-procedures)
- **[advice] Intercom Fin metrics:**
  - the headline metric is the share of conversations where Fin answered and resolved, out of those where Fin was involved;
  - Automation Rate = Involvement Rate × Resolution Rate;
  - customers complain that Fin "assumes" resolution when staff step in early, which inflates counts under per-resolution pricing;
  - Anthropic's case study cites a **51% average out-of-the-box resolution rate**, up to 86% for some customers.
  
  — [Intercom community: "Fin's flawed assumed resolved & pricing design"](https://community.intercom.com/ask-the-intercom-team-about-fin-54/fin-s-flawed-assumed-resolved-pricing-design-8929); [myaskai: improve Fin resolution rate](https://myaskai.com/blog/how-to-improve-intercom-fin-resolution-rate); [Claude customer story: Intercom](https://claude.com/es/customers/intercom)
- **[advice/research] Guardrails and escalation in deployed customer-support agents:**
  - Input and output guardrails, with outputs checked against labeled good and bad responses. Red-teaming covered prompt injection, history injection, non-English prompts and attempts to extract internal reasoning. — [arXiv 2605.16268 (2026)](https://arxiv.org/pdf/2605.16268)
  - A trust score per response, with fallback or **handoff to a human** when misaligned (NeMo Guardrails + Cleanlab TLM). — [NVIDIA dev blog](https://developer.nvidia.com/blog/prevent-llm-hallucinations-with-the-cleanlab-trustworthy-language-model-in-nvidia-nemo-guardrails)
  - Refunds escalate to a human before action, and support escalations fell 33% (vendor claim). — [Quiq](https://quiq.com/?p=34957)
  - **JourneyBench (EACL 2026 industry track):** policy adherence measured across 703 simulated conversations. An agent that explicitly models policy control improved adherence, and a smaller model with that design could beat a larger one. — [ACL Anthology preview](https://preview.aclanthology.org/credits/2026.eacl-industry.15)
  - **Nubank (June 2026):** an evaluation-driven framework linking offline development with online measurement for support agents serving 100M+ users. — [emergentmind summary of arXiv 2606.08867](https://www.emergentmind.com/papers/2606.08867)
- **[advice] Voice-agent latency.**
  - Human turn gaps are about 200 ms, and practical guides target roughly **600–1,200 ms end to end**.
  - Typical stage budgets: STT with endpointing 60–300 ms, LLM time-to-first-token 100–250 ms, TTS time-to-first-audio 40–200 ms, network 20–60 ms. VAD and endpointing can take 150–400+ ms and is often the largest hidden cost.
  - Stage intervals overlap and should not be naively summed.
  - A 2026 clinical-scale deployment saw a median final-VAD-to-first-audio of **667 ms with speculative generation vs. 1,513 ms without**. That figure is observational, not causal.
  - Third-party tests of 500 calls per platform found medians of about 680–850 ms voice-to-voice, worse than vendor claims.
  
  — [arXiv 2603.29893](https://arxiv.org/pdf/2603.29893); [Telnyx latency benchmark](https://telnyx.com/resources/voice-ai-agents-compared-latency); [Deepgram: voice agent pipeline guide 2026](https://deepgram.com/learn/voice-agent-architecture-stt-llm-tts-pipeline-design); [arXiv 2609.20995 Voice-Light (full-duplex, speculative generation)](https://arxiv.org/pdf/2609.20995)
- **[advice] Chinese e-commerce channel integration:**
  - Douyin's 飞鸽 customer-service platform bundles AI-robot reception, tickets, CRM and "十几个不同渠道" (a dozen-plus channels) of chat intake.
  - Third-party vendors recommend connecting directly by API where possible and using **RPA/UI automation** where no API exists, with permissions and data compliance designed up front.
  - Open-source ChatGPT-On-CS claims connectors for 千牛, 抖店, 拼多多, 小红书 and others.
  
  These are not official docs. — [App Store: 飞鸽智能客服](https://apps.apple.com/at/app/%E9%A3%9E%E9%B8%BD%E6%99%BA%E8%83%BD%E5%AE%A2%E6%9C%8D/id1617419334); [CSDN damodev 6a4337ec](https://damodev.csdn.net/6a4337ec662f9a54cb863aa9.html); [ChatGPT-On-CS (ecosyste.ms)](https://awesome.ecosyste.ms/projects/github.com%2Fcs-lazy-tools%2Fchatgpt-on-cs)

### Inferences
These are answer blueprints synthesized from the findings above. They are my own analysis, not from any interview report.

**(A) "设计一个能稳定遵循 SOP 的电商客服 Agent" (design an e-commerce customer-service agent that reliably follows SOPs).** A strong answer covers:
1. **Requirements and metrics first.** Define resolution rate (and how "resolved" is defined honestly; see the Fin "assumed resolution" problem), accuracy, policy-violation rate, handoff rate, CSAT, latency p50/p95 and cost per resolution.
2. **SOP as an explicit, versioned artifact.** Use a state graph or AOP-style procedure with nodes for intent, slot collection, verification, action and confirmation. The LLM handles understanding and phrasing inside a node. Transitions, preconditions and hard policy limits (refund caps, return windows, identity checks) are **enforced in code**, not in the prompt. This is the "natural language + code rigor" pattern from Decagon, and the research finding that explicit policy control beats a bigger model.
3. **Ground truth from systems.** Order status, logistics and inventory come from typed tool calls (platform APIs: 抖店/飞鸽, 千牛, 有赞, Shopee, Shopify). Tool arguments are schema-validated and idempotent, with timeouts and retries. RPA appears only as a fallback.
4. **Retrieval** over product, policy and FAQ content, with per-tenant (per-merchant) isolation and hot updates. The Tencent 面经 asked about RAG hot-updating.
5. **Output checks.** Claims about price, stock, delivery dates and policy must trace to a tool result or retrieved snippet, or the response is blocked or rewritten.
6. **Handoff, risk-tiered:** see (E).
7. **Multichannel adapters** (IM, email, voice) sharing one SOP engine.
8. **Observability:** a per-turn trace of state, retrieved docs and tool I/O.
9. **Release process:** an offline regression suite (see C), then shadow, then canary, then a per-merchant rollout.

**(B) "怎么把幻觉降到接近零" (how to drive hallucination close to zero).** A strong answer covers:
- A **taxonomy**: factual/product, policy (promising refunds that are not allowed), tool hallucination (wrong arguments or invented tools), task hallucination (claiming an action happened), and arithmetic/structure errors.
- **Prevention:** constrained decoding or structured outputs for actions, templated or slot-filled critical facts, abstaining when evidence is missing, and narrowing the LLM's freedom at high-risk nodes.
- **Detection:** a rule-based plus model-based claim-versus-evidence checker, and a trust or confidence score that routes to fallback or a human, as in the NeMo/Cleanlab pattern.
- **Measurement:** hallucinations per 1k turns on audited production samples, broken out by category, with **worst-case and tail reporting**, and pass^k on a fixed suite.
- **Honest framing:** "zero" holds only within a scoped, verifiable action space; outside it the agent must abstain or hand off.

**(C) "搭建评测集 / 测试流程" (build a test-set and evaluation pipeline). This is the most important prompt given Jekka's "90% of the team builds tests".** A strong answer covers:
- **Sources:**
  - mined production conversations, especially failures, escalations and complaints;
  - merchant SOP documents turned into scenario specs;
  - synthetic personas from a user simulator (τ-bench and Voice Sims style), with mood, patience, language and noise for voice;
  - adversarial and red-team sets.
- **Labels:** the expected end state (database/tool-call assertions, as in τ-bench), required and forbidden actions, and rubric items.
- **Graders:** deterministic checks first, then LLM-as-judge calibrated against human labels and monitored for bias, then human review on disagreements.
- **Levels:** component (intent, retrieval, tool selection), trajectory (correct path through the SOP) and end-to-end outcome.
- **Variance:** run k trials and report pass^k and per-scenario flakiness, not just the mean.
- **Gates:** CI on every prompt, model or SOP change, per-merchant regression suites, shadow and canary, and online drift monitors.
- **Tooling:** replay with recorded tool responses for deterministic debugging, and a diff view between versions. This is the "white-box debugging" Jekka describes.

**(D) "语音 Agent 延迟怎么做到 <1s" (how to get a voice agent under 1 s).** A strong answer covers:
- A budget with stages that overlap rather than add up.
- Streaming ASR, with endpointing/VAD tuning as the biggest lever.
- Speculative LLM prefill or generation on partial transcripts.
- A small or fast model for the first response with routing to a larger one, plus prompt caching.
- Streaming TTS that starts audio on the first clause, and filler or acknowledgement tokens.
- Barge-in and interruption handling.
- Regional colocation of ASR, LLM and TTS near the telephony gateway (SIP).
- Measuring p50/p95 final-VAD-to-first-audio on real calls, and simulated calls with noise, as in Voice Sims.
- Trade-offs against accuracy: voice cannot afford long verification chains, so precompute and cache verified facts per call.

**(E) "转人工怎么设计" (how to design human handoff).**
- **Triggers:**
  - explicit user request;
  - N consecutive intent failures or low confidence;
  - negative sentiment or rising frustration;
  - sensitive or legal topics;
  - high-risk actions (large refunds, account changes);
  - tool or system outages.
- **Packaging:** a summary, verified facts, the SOP state, actions already taken and the user's emotional state, so the human does not re-ask.
- **Channel continuity:** a warm transfer on voice.
- **Feedback loop:** each handoff becomes a labeled eval case.
- **Metric integrity:** report the handoff rate separately and never count a handoff as a resolution.

**(F) Architect-scope follow-ups to expect.**
- Multi-tenant scale. Jekka claims millions of interactions and hundreds of millions of tokens per day (see Q3).
- Per-merchant configuration and versioning of SOPs.
- Cost per conversation and model routing.
- Data isolation and compliance across China, the US and Southeast Asia.
- Long-running case state that persists across sessions and channels.
- Platform rate limits.
- Build vs. use a framework (LangGraph and similar) and why.

### Gaps
- No Chinese interview report describing an interviewer's *expected* answer for the customer-service scenario was readable in full. The blueprints above are synthesized.
- No official docs for Douyin 飞鸽 / 抖店 open-platform robot integration, the Youzan customer-service API or the Shopee chat API were retrieved, so integration details are unverified.
- Parloa and PolyAI engineering material was not covered in this pass. Intercom's official Fin engineering methodology (as opposed to community threads) was not found.

---

## Q3. Given Jekka's public statements, which topics should a candidate prepare, and which questions should the candidate ask the company?

### Takeaway
Interviewers will very likely probe these themes:
1. **reliability, worst-case and variance control** over peak intelligence;
2. **SOP adherence** through a code-level control structure around the LLM, with white-box, traceable debugging;
3. **test-set, test-process and test-tool engineering** as the core discipline;
4. **voice agents** (latency, interruptions, telephony);
5. **e-commerce platform integrations** (Shopee, Shopify, Douyin, Youzan);
6. **unit economics** under usage-based, outcome-linked pricing;
7. the founder's scepticism of scaling-law hype.

The candidate's production tool-use agent (per-request cost telemetry, 146 tests) maps directly onto themes 3 and 6 and partly onto 2. The main gaps are voice, the e-commerce domain, high-volume multi-tenant scale, Chinese platform APIs and architect-level years of experience.

### Cited Findings
**Jekka themes (company self-statements, Oct 2025; not independently verified)**
- Episode: ZhenFund 《此话当真》, "对话真人级 AI Agent 客服 Jekka 创始人：AI 的边界、大规模实践与终点". It was published about 2025-10-27, and the 53AI write-up "从 Sierra 到 Jekka" followed on 2025-10-28. ZhenFund produces the podcast and appears as a Jekka backer, so this is not independent coverage. — [小宇宙 episode](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437); [53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html); [网易 repost](https://c.m.163.com/news/a/KCUQ66CJ0511B6FU.html); [Podwise](https://podwise.ai/dashboard/episodes/5698963). Date and backer details are from sibling notes in `Jekka AI 公司调研/`.
- **Reliability over intelligence and variance:**
  - what makes AI "靠谱" (dependable) is not its occasional ceiling but **its stability and variance control in the worst case**;
  - "AI 不该只追求 PhD 级的智力，而要先解决「靠谱」的问题" (AI should not only chase PhD-level intelligence; it must first be dependable), meaning stable, correctable, with memory and able to learn;
  - "99% 的泡沫都来自对 Scaling Laws 的过度迷信" (99% of the bubble comes from over-faith in scaling laws), so he prefers to learn AI's limits bottom-up from test results.
  
  — [此话当真 podcast page](https://www.xiaoyuzhoufm.com/podcast/646f194853a5e5ea1408d97c); [Podwise](https://podwise.ai/dashboard/episodes/5698963); [53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html)
- **Control structure and white-box debugging:**
  - AI alone cannot solve hallucination, so Jekka built a **"类神经网络的控制结构"** (neural-network-like control structure) on top of the LLM;
  - it combines the LLM's generalization with a white-box, human-like reasoning process;
  - when an answer is wrong, the team can trace the root cause quickly and adjust how the model understands the case.
  
  — [搜狐](https://m.sohu.com/a/948536090_355029/); [53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html) (via sibling notes)
- **Testing culture:** "Jekka 团队里 90% 的人都在搭建测试集、测试流程和测试工具" (90% of the Jekka team builds test sets, test processes and test tools). The team reportedly comes from MSRA, Amazon, Google and Alibaba. — [Podwise](https://podwise.ai/dashboard/episodes/5698963); [53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html)
- **Claimed outcomes and scale:**
  - 80%+ independent resolution and 99%+ accuracy;
  - "完全遵循 SOP" (fully follows SOPs);
  - SOP-following learned from 100k to 1M dialogue and phone turns a day;
  - millions of text and voice interactions and hundreds of millions of tokens a day;
  - "抖音、有赞首家官方模型提供商" (first official model provider for Douyin and Youzan), not corroborated by Douyin or Youzan sources;
  - a North American logistics customer runs 24/7 phone answering.
  
  — [53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html); [搜狐](https://m.sohu.com/a/948536090_355029/); [小宇宙](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437)
- **Products:**
  - "Jekka Quanta Engine | Heisenberg", described as "32-bit enterprise-grade floating-point computing. Zero hallucinations. Pinpoint precision.";
  - a "Voice AI Agent" for inbound and outbound calls;
  - DouDou (e-commerce customer service) and DuoDuo (shopping assistant);
  - the DuoDuo site credits "自研 Jekka-Markov 大模型提供可控、可验证的 AI 对话能力" (a self-developed Jekka-Markov model providing controllable, verifiable dialogue) and claims "100% 零幻觉" (100% zero hallucination).
  
  — [jekka.ai](https://jekka.ai/); [jekkaduoduo.com](https://www.jekkaduoduo.com/) (via sibling notes)
- **Pricing:** usage-based and linked to actual results. The founder noted AI's cost structure differs from SaaS because every run consumes tokens. — [53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html); [搜狐](https://m.sohu.com/a/948536090_355029/)
- **Channels:** Shopee CB service market (official platform API), Shopify app (WhatsApp, email), plus e-commerce platforms, web chat, email, social and phone (2024 deck). — [Shopee CB product page](https://service.shopeecb.cn/software-support/2005/product-116); [CAREC 2024 deck](https://www.carecprogram.org/uploads/6.-CAREC-AI-Seminar-2024-Jekka-Shopify.pdf)
- **Peer context the founder invokes:** he admires Sierra (Bret Taylor) and names Sierra and Decagon as companies treating customer service as a core track. Sierra publicly stresses pass^k consistency (τ-bench) and simulation-based testing, chat and voice; Decagon stresses AOPs (Q2). — [53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html); [Sierra benchmarking blog](https://sierra.ai/uk/blog/benchmarking-ai-agents); [Decagon AOP blog](https://decagon.ai/blog/from-sops-to-agent-operating-procedures)
- **Possible confusion to avoid: "Jev".** Another model called "Jev" also markets "零幻觉" (zero hallucination).
  - It returns choices, scores and probabilities rather than free text, through Choice, Noul and Score APIs.
  - A commentator on X says its "零幻觉" really means **zero type/structure errors, not semantic correctness**.
  - No source links Jev to Jekka.
  
  — [GitHub ChiyuSONG/inside-jev](https://github.com/ChiyuSONG/inside-jev/tree/main); [X @vista8](https://x.com/vista8/status/2100775218830815554)

### Inferences
**Topics to prepare, ranked by likelihood they will be probed, with links to the candidate's experience:**
1. **Eval and test infrastructure.** Expect the deepest probing here, given the "90% on tests" claim.
   - Prepare a concrete walkthrough of the 146-test suite: what is unit-tested, what is integration-tested against recorded tool responses, and what is evaluated with LLM-judged or rubric checks.
   - Explain how regressions are caught when a prompt or model changes, and how flaky (nondeterministic) cases are handled.
   - Add a pass^k-style consistency number to the story, for example by re-running a fixed scenario set k times.
   - Be ready to design the full pipeline in Q2 (C).
   - *Mapping: strong.* *Gap:* scale (per-merchant suites, thousands of SOP variants) and simulation of synthetic users.
2. **Reliability and variance: what "worst case" means operationally.**
   - Tail metrics, abstain/handoff, constrained actions, determinism controls (temperature, structured outputs, recorded replays).
   - Have a balanced, evidence-based view on "scaling-law hype". The founder holds a strong opinion, and a founder round may test whether the candidate thinks empirically rather than repeating hype or contrarianism.
3. **SOP and control layer around the LLM, and white-box debugging.**
   - Explain how the video-library agent constrains tool use (tool schemas, routing, guards).
   - Explain how you trace a bad answer to its root cause (per-request telemetry and traces).
   - Prepare a state-machine/AOP design and a view on where the LLM should and should not decide.
   - *Mapping: partial.* The candidate's agent is open-domain tool use over a video library, not SOP execution with transactional side effects (refunds, order changes).
4. **Cost and unit economics under outcome-linked pricing.**
   - Per-request cost telemetry is a direct match.
   - Extend the story to cost per *resolution*: model routing, caching, prompt compression, and how cost and quality trade off.
   - Sanity-check Jekka's own numbers: millions of interactions against hundreds of millions of tokens implies roughly 10²–10³ tokens per interaction (sibling-notes inference), which suggests compact prompts or small models.
5. **Voice agents.**
   - Learn the latency budget, VAD/endpointing, streaming ASR and TTS, barge-in, telephony (SIP/PSTN), speculative generation and voice-specific evals (Q2 D).
   - *Gap: large.* The candidate has no voice experience. Mitigate by building a small streaming voice demo and measuring its latency before the interview.
6. **E-commerce domain and Chinese platforms.**
   - Learn pre-sale, in-order and after-sale (售前/售中/售后) flows: returns and refunds, logistics queries, coupons, size recommendations, cart recovery.
   - Learn the merchant-side tools: 抖店 / 飞鸽, 千牛 (Taobao), 有赞, Shopee Seller Center chat, Shopify.
   - Know that platform response-time metrics and policy rules shape agent design; specific metric definitions were not researched here.
   - *Gap: large.* The Gemini short-video consumer-insight pipeline is a partial bridge: it shows consumer and e-commerce content understanding and structured extraction at batch scale.
7. **Scale and multi-tenancy.**
   - Concurrency, per-tenant isolation, SOP versioning, rollout and observability for millions of conversations a day.
   - *Gap:* the candidate's systems are single-product, production but not at this volume. Be explicit about what you would do differently at 100× scale.
8. **Own models.** "Jekka-Markov" and "Heisenberg" imply fine-tuning or in-house models.
   - Expect questions on when to fine-tune versus prompt, distillation into smaller models for latency and cost, and data flywheels from production conversations.
   - The hello-agents and 5-year 面经 reports say fine-tuning experience raises pass rates.
   - *Gap:* no fine-tuning stated in the candidate's background.
9. **Years of experience and the "架构师" title.** Architect-level question banks focus on platform design (millions of sessions, checkpoint/resume, permissioning). As an M.S. student, expect questions on whether you can own an architecture. Frame the shipped production agent as end-to-end ownership, and ask whether the role's level is flexible.

**Questions for the candidate to ask Jekka (designed to show insight and to do due diligence):**
1. **Control structure:** what does the "neural-network-like control structure" look like in practice? Is it a state machine, a learned router or classifier stack, or a verifier over LLM outputs? Where does the LLM have freedom and where is it constrained?
2. **"Zero hallucination":** how is it defined and measured? What is in scope (facts from tools and KB, policy promises, actions taken)? What happens out of scope: abstain or hand off? What is the audited hallucination rate on production samples?
3. **Variance:** do you track pass^k or worst-case metrics per merchant? What is the release gate when a base model or SOP changes?
4. **Test organization:** if 90% of the team works on tests, how are test sets built (production mining, synthetic users, merchant-supplied SOPs)? Who owns them? How do LLM-judge graders get calibrated against humans?
5. **White-box debugging:** when a merchant reports a bad answer, what is the path from ticket to root cause to fix to regression test? How long does it take?
6. **Models:** what is "Jekka-Markov" or Heisenberg relative to third-party base models: fine-tunes, distilled small models, classifiers? How are production conversations used for training while respecting merchant and buyer data rights?
7. **Voice:** what latency target and stack (ASR, TTS, telephony; in-house or vendor)? How are interruptions and noisy calls evaluated?
8. **Integrations:** which platforms use official APIs and which use other methods (for example RPA/UI automation)? How do platform rule changes on Douyin, Youzan and Shopee hit reliability?
9. **Metrics and pricing:** how is a billable "resolution" or outcome defined and audited, so it avoids the "assumed resolution" problem seen with Intercom Fin? What is gross margin per conversation?
10. **Scope of this role:** what does "Agent 架构师" own (core engine, per-merchant delivery, eval platform, voice)? Who are the peers and the reporting line? What would success look like in 3 and 12 months?
11. **Team and markets:** how is the team split across Hangzhou, Singapore and the US? Is the role on-site in Hangzhou? What language is used for work? How much of the business is China domestic versus cross-border?
12. **Company health:** runway and funding stage (USD funds, undisclosed), customer concentration, and the competitive answer to platform-native assistants (for example Youzan's own AI).

### Gaps
- The founder's full name, whether a CTO interviews, and who would run each round are unknown.
- Jekka's actual architecture, base models, voice stack and latency targets are undisclosed. Every "control structure" interpretation is inference.
- The podcast audio and the full 53AI text could not be read here (blocked). Quotes come from search snippets and sibling notes.
- Whether the Douyin and Youzan "official model provider" claim is real could not be verified.
- The role's required years of experience and level come from the job-posting research, a sibling task, not this note.

---

## Q4. Are there any reported interview experiences specifically at Jekka / 西格莫伊德?

### Takeaway
**None found.** Searches for "Jekka 西格莫伊德 面试" returned only unrelated 一亩三分地 threads (ByteDance, Sigma Computing) and Jekka's homepage. Sibling research found no candidate or employee reviews on Glassdoor, Blind, Indeed, Levels.fyi, 脉脉, 看准 or 牛客. Process expectations for Jekka must therefore be inferred from the startup pattern in Q1 and from the founder's stated priorities in Q3.

### Cited Findings
- A search for "Jekka 西格莫伊德 面试" on 2026-10-16 returned no Jekka interview content, only unrelated 1point3acres threads and [jekka.ai](https://jekka.ai/). — e.g. [1point3acres ByteDance thread](https://www.1point3acres.com/bbs/thread-654744-1-1.html); [1point3acres Sigma Computing thread](https://www.1point3acres.com/bbs/thread-999130-1-1.html)
- Sibling research: "I found **no** employee or candidate reviews or interview reports on Glassdoor, Blind, Indeed, Levels.fyi, 脉脉, 看准 or 牛客". Company size is 50–150 per a Hangzhou Dianzi University campus-recruiting profile. — `research_notes/Jekka AI 公司调研/hiring_reputation_news.md`, citing [HDU job site](https://job.hdu.edu.cn/company/view?id=890293)
- The agent-interview-hub collection likewise has **no real 面经 for startups** as a category, only job requirements and questions. — [GitHub agent-interview-hub](https://github.com/Zchary1106/agent-interview-hub)

### Inferences
- The absence of reports fits a small company hiring under an obscure legal name (杭州西格莫伊德智能科技有限公司). The candidate should ask the recruiter directly for the number of rounds, whether there is a take-home or live coding, whether a founder or CTO round exists, and the language of the interviews (Chinese, English or mixed).
- Given the founder's public emphasis, the most likely distinctive element is **a deep probe of how the candidate tests and evaluates agents**. A design exercise around SOP-following customer service or eval pipelines is also likely.

### Gaps
- 脉脉 and 小红书 could not be searched directly, since both are login-walled or blocked. A 小红书 search for "Jekka 面试" or "西格莫伊德" from a logged-in phone would be the best remaining check.
- Jekka's official careers page (if any) and BOSS直聘 listings could not be accessed; zhipin.com was blocked by the proxy.
