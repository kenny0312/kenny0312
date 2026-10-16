# 用评测功底撬开 Jekka 的 Agent 架构师岗位

截至 2026 年 10 月 16 日，**Jekka AI（经营主体为杭州西格莫伊德智能科技有限公司）没有任何能公开检索到的“Agent 架构师”JD**，唯一的校招雇主页也显示“0 职位在招”，所以这个岗位的职责、要求、级别和薪酬都只能推断。可核实的线索很少：杭电就业网雇主页所列地址在杭州余杭，约 2025 年初的规模为 50–150 人；岗位所在地大概率是杭州，远程政策未知。参照国内外同类岗位，最合理的形态是“平台架构为主、客户交付为辅”，负责 SOP 状态控制层、工具与平台集成层、评测与回归体系，并延伸到语音链路。国内挂“架构师”头衔的 Agent 岗普遍要求 **5–10 年经验**，杭州标价多为 **月薪 4–8.5 万元、13–20 薪**。以下区间均为推断：在一家大概率处于种子轮到 A 轮（融资从未披露）的初创公司，资深候选人约为 **月薪 5–8 万 × 13–15 薪**，以“核心 Agent 工程师”定位入职的偏初级候选人约为 **2.5–4.5 万 × 13–15 薪**，另加约 0.1%–0.5% 的期权。面试大概率是 2–4 轮，围绕项目深挖、客服 Agent 系统设计和创始人面展开，联合创始人 Aaron 公开强调的“最差情况下的方差控制”“白盒调试”和“九成团队在做测试”很可能会被追问。提问者做过的 VideoSense 是一个已上线的工具调用 Agent，带每请求成本遥测和 146 个测试，与测试、成本两条主线吻合，但评测能力还要用 pass^k 数据来证明；缺口最大的是语音与电话链路、中国及跨境电商平台 API 和架构师头衔要求的工作年限，多租户规模与自研模型微调次之。最务实的策略是以“带架构所有权的核心 Agent 工程师”定位应聘，带着实测的 pass^k 与延迟数字进场。

> **证据说明**：调研期间几乎所有网页都无法直接打开（DNS 解析失败或代理返回 403），除少数能直接打开的 GitHub 题库外，下文事实均来自搜索引擎对所引页面的索引摘录，措辞可能经过转述。招聘平台的薪资是标价而非成交价，多数只有“2026 年”页面标签，没有精确发布日期。公司自述的数字一律按营销口径处理。凡标注“推断”的内容，是根据市场数据和公开表述做的分析，不是 Jekka 提供的信息。

## 全网查不到这份 JD，职责与级别只能当面向公司索取

调研共做了 20 组检索，另有一组网页直接抓取全部被拦截。在 Jekka 自己的域名（jekka.ai、jekkaduoduo.com、jekka.cn）内搜“招聘”“加入我们”“careers”，只返回首页、价格页和中国镜像站，没有招聘页；首页摘要里只有“Book a Demo”和产品链接 ([jekka.ai](https://jekka.ai/); [jekka.ai/price](https://jekka.ai/price))。把“西格莫伊德”限定在 BOSS直聘、猎聘、拉勾、脉脉、智联、前程无忧、牛客、实习僧、应届生和看准这 10 个招聘站内检索，**结果为零**。在公众号、即刻、小红书、知乎、V2EX、LinkedIn、X、电鸭和 LINUX DO 上搜“Jekka AI 招聘 Agent”，返回的全是别家公司的 Agent 岗位。唯一能确认的招聘痕迹是杭州电子科技大学就业网上的雇主页：**0 职位在招**；页面被索引时，信息已有约 647 天，大致对应 2025 年初。雇主页所列地址为余杭区五常街道文一西路 998 号 4 幢 701 室，企业性质为三资企业，规模 50–150 人 ([杭电就业网](https://job.hdu.edu.cn/company/view?id=890293))。2025 年 10 月那期播客是可检索到的创始人唯一一次公开发声，此前公司只有 2024 年 9 月销售合伙人 Tong Zhao 在亚洲开发银行支持的 CAREC 研讨会上的一次演讲 ([CAREC 议程](https://www.carecprogram.org/uploads/CAREC-AI-Seminar-Final-Agenda-Printed-Booklet.pdf))。已索引的节目简介里也没有招人信息 ([小宇宙](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437))。

查不到不等于岗位不存在。一家 50–150 人、用冷门法人名招聘的公司，职位通常只挂在 BOSS直聘或猎聘的 App 内，或者通过猎头、内推和微信群流转；App 内的职位需要登录才能看，搜索引擎基本不收录。Jekka 官网链接的社交账号是 X 上的 @Jekka_Sigmoid 和一个个人主页格式（/in/）的 LinkedIn 账号，并不是带“职位”栏的公司主页 ([jekka.ai](https://jekka.ai/))，可见英文渠道基本不承担招聘。如果提问者是在某处看到了这个职位，最直接的办法有三步。先在 BOSS直聘和猎聘 App 内分别搜“西格莫伊德”“西格莫伊德智能”“Jekka”和“杭州西格莫伊德智能科技”，因为公司页常挂在简称而不是法人全称下，同时留意招聘者的头衔和最近活跃时间。再登录脉脉和小红书搜“Jekka 面试”和“西格莫伊德”，这是目前最有希望找到面经的渠道。如果仍然没有结果，就给官网链接的 X 或 LinkedIn 账号发私信；无论从哪条渠道联系上，都请对方发一份书面 JD。检索时要排除两个同名干扰项：一是班加罗尔一家同样叫 Sigmoid 的数据分析公司，二是中文“Jekka 招聘”结果里排在前面的缝纫设备商杰克科技 ([startup.jobs](https://startup.jobs/company/sigmoid-company); [猎聘](https://m.liepin.com/company/8444613/))。

公开渠道里有两条线索与这个岗位相关，但都不能当作 Jekka 的 JD。

第一条是电鸭上的一则招聘，标题完全吻合：“AI Agent Architect（AI Agent 架构师）”，杭州，可远程协作，1 个名额。职位要为一家电商公司做一个能用自然语言操作 ERP 的标准化 Agent，覆盖订单、库存、售后客服和财务对账。技术栈点名 **LangGraph 状态机、CrewAI 多智能体协作、工具调用、RAG 知识库与业务记忆、MCP 集成和 Human-in-the-Loop** ([电鸭](https://eleduck.com/posts/0Xfa9B))。雇主是自建内部系统的电商企业，团队只有“项目负责人加后端”，和 Jekka 这种自称有自研模型的 Agent 供应商对不上。它的价值在于展示了杭州市场对“Agent 架构师”的典型技术想象。

第二条是 V2EX 上约 2023 年 10 月的一则帖子。发帖的是一家“总部位于新加坡、同时在杭州设有办公室”的 AI Agent 初创公司，招前端、后端和 AI 系统研发：后端要求 Python，Ruby、Java 或 PHP 加分；前端要求 React 和 TypeScript ([V2EX](https://www.v2ex.com/t/980725))。有三点指向早期的 Jekka：新加坡加杭州的布局；约两个月后，新加坡开发者“Hello Jekka”在 Shopify 上线了应用 ([Shopify App Store](https://apps.shopify.com/hellojekka-ai-sales-chatbot))，不过该应用与 Jekka.ai 是否同一家公司本身也只有中等把握；Ruby 又与 Shopify 生态相关。但帖子没有点名公司，而且是三年前的信息，最多只能说明后端以 Python 为主，证据很弱。

没有 JD，就只能从业务反推岗位内容。官网目前列出四条产品线：号称“32 位企业级浮点计算、零幻觉”的 **Heisenberg（Jekka Quanta Engine）**，负责呼入与外呼的 **Voice AI Agent**，电商“真人级”客服 **DouDou**，以及导购 **DuoDuo**。官网还展示了为 Oxy 构建 AI 采购 Copilot 这类定制项目 ([jekka.ai](https://jekka.ai/))。哆哆官网称产品基于“自研 Jekka‑Markov 大模型提供可控、可验证的 AI 对话能力” ([jekkaduoduo.com](https://www.jekkaduoduo.com/))。哆哆通过官方 API 入驻 Shopee 跨境服务市场的智能客服类目，服务市场与第三方工具目录的列表摘要写的是“依托自研 Jekka‑Markov 架构，业务场景零幻觉输出，AI回复准确率超95%” ([Shopee 服务市场](https://service.shopeecb.cn/software-support/2005/product-116); [aishenqi](https://aishenqi.net/tool/jekka-ai))。创始人称公司每天处理数百万次文本与语音交互 ([53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html))。由此推断，这个岗位很可能面对一个**多租户、多渠道、文本加语音、强 SOP 约束**的客服系统，而不是从零起步的内部工具；这个判断来自公司自述，不是 JD 信息。地点上，杭州余杭是唯一对得上经营主体的办公地。官网另列的新加坡、香港和威尔明顿三处，在可检索范围内都查不到登记实体。新加坡查不到“Jekka Pte Ltd”，Toolify 给出的运营方 MATRIX TRADE PARTNERS PTE. LTD. 按名称精确检索也查无此公司 ([Toolify](https://www.toolify.ai/tool/jekka-ai-chatbot); [ACRAWatch](https://acrawatch.sg/company/u-matrix-pte-ltd))。美国方面只有“威尔明顿”这个地名，没有特拉华州的登记记录；威尔明顿是注册代理机构的集中地，这个“办公室”更像注册地址，而不是有人上班的团队（推断）。级别、汇报线和远程政策，公开信息里都没有。

## 同类岗位普遍要 5–10 年经验，杭州月薪集中在 4–8.5 万元

### 职责：平台架构为主，客户交付为辅

国内企业对“Agent 架构师”的定义相当一致。塔斯汀在上海招聘“高级 AI 应用架构师（Agent 方向）”，要求主导 **Context Engineering 与 Multi-Agent 架构**，搭建 Agent Skill 生态、Tool Calling 体系和 Workflow 编排平台，负责 Prompt Pipeline、Memory、Planning、Tool System 等核心模块，并满足高并发、低延迟和稳定性要求；任职要求点名 ReAct、Plan-and-Execute、Reflection 和多智能体协作 ([V2EX](https://www.v2ex.com/t/1217892))。综合多份 JD，架构师还要做四件事：把企业现有系统封装成 Agent 可调用的工具；设计防止危险输出的护栏；建立量化准确率、幻觉率和安全性的**评测框架**；用多模型路由平衡成本与延迟 ([京北方 Agent 算法架构师](https://www.zhaopin.com/jobdetail/CC315847110J40865278007.htm); [CSDN 岗位指南](https://adg.csdn.net/6a2b79b010ee7a33f27b8948.html))。

美国客服 Agent 公司的同名岗位更偏交付。Parloa 的“Lead AI Agent Architect”隶属专业服务团队，日常工作是梳理客户需求、拆解复杂流程、编写提示词、做对话设计、用 **SSML 调校 TTS 发音**，并与 Forward Deployed Engineer 合作，通过 API 打通 CRM 和工单系统 ([Greenhouse: Parloa](https://job-boards.greenhouse.io/parloa/jobs/4566280101))。Sierra 不用“架构师”这个叫法，它的 AI Agent Engineer 负责从试点到上线再到持续调优的全过程，并把客户反馈带回平台 ([Sierra 博客](https://sierra.ai/blog/meet-the-ai-agent-engineer))。杭州也有交付侧的变体：一家小公司在 LINUX DO 上招 AI Agent 方向的 FDE / 全栈工程师，工作是到企业客户现场私有化部署 Agent 平台，要求约 3 年前端、后端和运维经验，发帖人坦言薪资“实话说不高” ([LINUX DO](https://linux.do/t/topic/2889824))。

岗位名称也可能误导。知乎上有讨论指出，不少公司用“大模型应用工程师”的 JD 招“AI Agent 工程师”，候选人应当问清楚工作是“调 API 搭应用”还是“搭 Agent 系统” ([知乎](https://zhuanlan.zhihu.com/p/2004969517344900750))。大云厂商的“Agent 解决方案架构师”则是售前岗位 ([猎聘 杭州](https://www.liepin.com/city-hz/zpxfzjjfajgsh18h/))。

结合 Jekka 的产品形态，最合理的判断是：这个岗位以**平台架构**为主，负责 SOP 状态控制层、工具与渠道适配层、评测与回归体系和语音链路，还要管按商户配置 SOP 的版本管理和灰度发布；同时承担一部分 Parloa 式的**客户交付**，把 500 强客户或大商户的 SOP 和系统集成做成可上线的 Agent。创始人自称九成团队在做测试，评测平台本身也很可能归这个角色负责。在一家 50–150 人的初创公司，“架构师”更多是职责范围的标签，而不是严格的职级（推断）。

### 经验门槛：大公司要 5–10 年，初创公司更看生产证据

挂“架构师”头衔的 Agent 岗位绝大多数要求 **5–10 年经验**。北京某上市互联网公司的 Agent 架构师、比亚迪相关的 Agent 平台架构师、杭州西湖区某上市药企的资深 AI 智能体架构专家都写 5–10 年；杭州另一个 AI 架构师岗位要求 7 年以上 ([猎聘 AGENT架构师](https://www.liepin.com/s/adykrjjgzsxmk15k0u/); [猎聘 杭州](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/); [猎聘 杭州架构师](https://www.liepin.com/city-hz/career/360321/))。顺丰的大模型应用系统架构师要求硕士学历加 5–10 年经验 ([顺丰招聘](https://hr.sf-express.com/JobSearchById/61769,3))。领域上最接近 Jekka 的，是 V2EX 上一家杭州跨境电商招的“研发经理 / 技术架构师（含 AI Agent）”，要求本科加 5 年以上或硕士加 4 年以上经验，并做过已上线的 Agent 产品 ([V2EX](https://www.v2ex.com/t/1234409))。例外也有：杭州一个“AI 模型架构师”只要 1–3 年经验加硕士学历，一家量化机构的“LLM 智能体开发”不限经验 ([猎聘 杭州](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/))；猎聘聚合页上，一家大型科技集团在杭州招的“Agent 架构 / AI 工程架构师”标价 4.5–7.5 万 ·16 薪，同样不限经验，但搜索摘要没有说明它出自哪个聚合页 ([猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/))。美国方面，Parloa 的架构师要求 4 年或 6 年以上面向客户的技术经验；Sierra 不设年限，还开放了“Software Engineer, Agent (New Grad 2027)”这样的应届生通道 ([Greenhouse: Parloa](https://job-boards.greenhouse.io/parloa/jobs/4566280101); [Jobright: Sierra New Grad](https://jobright.ai/jobs/info/6a95f517f28891320e85f4e9))。

市场正在向有经验的一端倾斜。猎聘与清华 2026 年 6 月的报告显示，Agent 人才需求增长约 **40%**，但**自 2025 年三季度起，入门级和进阶级需求下降，专家级和领军级需求继续上升** ([腾讯新闻](https://view.inews.qq.com/a/20260618A04X5K00?scene=news-skill))。BOSS直聘的数据显示，AI 岗位的薪资溢价从 2022 年的 3.3 倍降到 2025 年的 2.6 倍 ([新浪财经](https://finance.sina.com.cn/stock/t/2026-01-23/doc-inhihnix5030139.shtml))。两组数据合起来看，泛泛的“AI 应用”岗位正在变得普通，能拿出上线系统、遥测数据和测试体系的人更接近稀缺的一端（推断）。对 Jekka 这个体量的公司，年限要求通常更有弹性，上线证据是应届候选人最有力的补偿（推断）；但 Jekka 自称团队来自 MSRA、亚马逊、谷歌和阿里 ([53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html))，实际门槛要在面试中确认。

### 薪酬与期权：按杭州行情和融资阶段倒推

| 岗位（雇主） | 城市 | 月薪标价 | 经验要求 | 来源 |
|---|---|---|---|---|
| AI Agent 架构师·智能供应链（阿芙） | 杭州 | 3–4.5 万 | 3–5 年，本科 | [猎聘](https://www.liepin.com/job/1980007751.shtml) |
| 资深 AI 智能体架构/开发专家（上市药企，猎头代招） | 杭州西湖 | 4–7 万 ·13 薪 | 5–10 年 | [猎聘](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/) |
| 弹性计算 Agent 解决方案架构师（大型互联网公司） | 杭州 | 4–7 万 ·16 薪 | 5–10 年 | [猎聘](https://www.liepin.com/city-hz/zpxfzjjfajgsh18h/) |
| AI 架构师 | 杭州 | 5–7 万 ·14 薪 | 7 年以上 | [猎聘](https://www.liepin.com/city-hz/career/360321/) |
| AI 平台架构师 / AI Agent 专家（游戏公司） | 杭州 | 5–7 万 | 5–10 年 | [猎聘](https://www.liepin.com/zpaiptjgs/) |
| AI Agent 产品与系统架构师（金融科技） | 杭州北山 | 4–6 万 | 5 年以上，本科 | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/)（具体页面待核） |
| AI Agent 研发架构师 | 杭州文明路 | 4–6.5 万 | 5 年以上，本科 | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/)（具体页面待核） |
| Agent 架构 / AI 工程架构师（大型科技集团） | 杭州 | 4.5–7.5 万 ·16 薪 | 不限经验，本科 | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/)（具体页面待核） |
| 大模型产品解决方案架构师 | 杭州余杭 | 5.5–8.5 万 ·20 薪 | 5–10 年 | [猎聘](https://www.liepin.com/city-hz/zprgznkfkyggq9l5/) |
| Agent 架构师（上市互联网公司） | 北京 | 7–10 万 ·18 薪 | 5–10 年 | [猎聘](https://www.liepin.com/s/adykrjjgzsxmk15k0u/) |
| 高级 AI 应用架构师·Agent 方向（塔斯汀） | 上海 | 2–4 万 ·14 薪 | 未显示 | [V2EX](https://www.v2ex.com/t/1217892) |
| AI 服务端工程师·Agent 方向（MiniMax） | 上海 | 4–6 万 | 未显示 | [猎聘](https://www.liepin.com/job/1984221441.shtml) |
| AI 服务端开发 / AI 应用工程师 | 杭州 | 3–6 万 ·16 薪 / 1.5–3 万 ·14 薪 | 未显示 | [BOSS直聘](https://www.zhipin.com/zhaopin/bc93fb236b750e601HZ93dS0EQ~~/) |
| 2026 校招 Agent 开发工程师（钛动科技） | 广州/北京/杭州 | 1.8–3 万 ·15 薪 | 应届 | [牛客](https://www.nowcoder.com/jobs/detail/441167?urlSource=sitemap) |

按月薪乘以月数折算成年度税前现金，并假设各月足额发放：除下文余杭那个 20 薪的岗位外，杭州挂架构师头衔、标明月数的岗位约在 **52 万至 120 万元**之间，未标月数的阿芙（3–4.5 万）按 12–13 薪只有约 36 万至 59 万元；余杭那个 20 薪的解决方案架构师可达 110–170 万元；北京大厂的 7–10 万 × 18 薪是 126–180 万元。应届方向，钛动的校招 Agent 开发折合约 27–45 万元；前程无忧统计的 2026 届大模型算法工程师校招月薪中位数是 **24,760 元** ([神州学人网](http://www.chisa.edu.cn/bussiness/202508/t20250826_2111382322.html))。一篇二手文章称，2026 届大厂大模型应用开发硕士的标准（“白菜”）包约 **35–48 万元**，SP 约 **60 万元以上**，但没有说明样本来源，可信度低 ([CSDN](https://gitcode.csdn.net/6a06e78310ee7a33f272cf79.html))。

Jekka 在杭州要和阿里云、钉钉、淘天以及资金充裕的大模型公司抢人。它的融资阶段同样只能推断：官网列出的投资方是主投天使轮至 A 轮的真格基金、专注 B2B 的早中期基金云启资本，以及更像非股权支持的 Google for Startups，没有成长期机构，也没有公开的定价轮 ([jekka.ai](https://jekka.ai/); [维基百科](https://zh.wikipedia.org/zh-hans/%E7%9C%9F%E6%A0%BC%E5%9F%BA%E9%87%91); [36氪](https://pitchhub.36kr.com/organization/1678201443005447); [Google Developers Blog](https://developers.googleblog.com/en/announcing-the-inaugural-google-for-startups-accelerator-ai-first-cohort/))，所以大概率处于种子轮到 A 轮。这个阶段的公司现金一般给不过大厂，通常拿期权和头衔来补。据此推断两个区间：5 年以上的资深候选人约为 **月薪 5–8 万 × 13–15 薪（约 65 万至 120 万元）**；另一种不分级别、只按猎聘可比岗位的推断是 4–7 万 × 13–16 薪（约 52 万至 112 万元），两者大体重叠。以“核心 Agent 工程师”定位入职、挂架构师头衔的偏初级候选人约为 **月薪 2.5–4.5 万 × 13–15 薪（约 33 万至 68 万元）**。这个区间的上沿已经高于上面的大厂 SP 门槛，只有手握大厂 SP offer 作为筹码时才现实；实际 offer 更可能落在区间下半段，再以期权补足（推断）。这些都是从市场数据推出来的，不是 Jekka 给的数字。

海外数据可以帮助判断该选哪地签约，但要分清数据类型：Levels.fyi 是用户自报的总包，杭州的数字是岗位标价。Levels.fyi 上，新加坡 AI 工程师总包中位数约 **9.3 万新元**，香港约 **37.2 万港元** ([Levels.fyi 新加坡](https://www.levels.fyi/t/software-engineer/title/ai-engineer/locations/singapore); [Levels.fyi 香港](https://www.levels.fyi/t/software-engineer/title/ai-engineer/locations/hong-kong-sar))。香港另一来源 ERI 的模型估算均值约 **72.7 万港元**，与 Levels.fyi 相差约一倍，香港的数字应视为未定 ([ERI](https://www.erieri.com/salary/job/artificial-intelligence-engineer/hong-kong-sar))。新加坡猎头给出的应届起薪是每月 3,500–5,000 新元 ([BGC Group](https://bgc-group.com/blogs/starting-as-an-ai-engineer-in-singapore/))。按 1 新元约 5.5 元、1 港元约 0.92 元粗算，新加坡自报中位数约合人民币 51 万元，与杭州资深岗位标价相当或更低；香港按两个来源分别约合 34 万和 67 万元，冲突较大。就提问者的级别而言，新加坡应届起薪按 12 个月计约合 23 万至 33 万元，低于本文推断的杭州偏初级区间。美国的天花板高出一大截：Sierra 的 Agent 工程师底薪标价 **18 万至 39 万美元**，Decagon 应届 Agent 工程师为 **18 万美元加股权**，Parloa 的 Lead AI Agent Architect 为 15 万至 20 万美元加股权 ([Sierra Ashby](https://jobs.ashbyhq.com/Sierra/e9f5fdb6-91ee-4c55-9230-41ec8865650e); [Prosple: Decagon](https://prosple.com/graduate-employers/decagon/jobs-internships/agent-software-engineer-new-grad); [General Catalyst: Parloa](https://jobs.generalcatalyst.com/companies/parloa/jobs/71585669-lead-ai-agent-architect))。但 MyVisaJobs、h1bdata 和 H1BGrader 上都查不到 Jekka 这个雇主，名字最接近的 Jenka Lab 是另一家公司 ([MyVisaJobs](https://www.myvisajobs.com/employer/jenka-lab/))；美国方面也没有证据表明有员工在岗。由美国实体雇用并担保签证的可能性很小，除非公司明确表示支持（推断）。

期权更难估。据二手整理的 Carta 数据，初创公司首位员工通常约获 **1.54%**，到第五位约 **0.48%** ([OnHealthcare](https://www.onhealthcare.tech/p/the-2025-playbook-for-early-stage))；另一份 Carta 衍生整理给出的首位员工中位数约为 1% ([Mucker](https://mucker.com/blog/compensation-benchmarks-early-stage-startups-from-carta/))。第 4–10 号资深工程师常见 0.5%–1.0%，最早一批员工拿到的是 A 轮后入职工程师的 4–8 倍 ([Startup Science](https://www.startupscience.io/articles/startup-employee-equity))。国内较早的经验是：A 轮前加入的中级工程师约拿 0.27%，天使轮前承诺的比例每经过一轮融资大约减半 ([知乎](https://www.zhihu.com/question/20495836); [36氪](https://www.36kr.com/p/685728081924737))。Jekka 约 2025 年初已有 50–150 人，新加入者早已不是“前十号员工”。按上述规律推断，若公司处于种子轮到 A 轮，合理区间约为完全稀释股本的 **0.1%–0.5%**。但团队已有 50–150 人，2026 年入职者大概率排在前 30 名工程师之后，所以这个区间可能偏高：偏初级的核心工程师应以下沿甚至更低为预期，只有真正的创始级架构师才可能更高（推断）。比例本身不如条款重要。杭州实体是三资企业，官网又列出威尔明顿，期权大概率在离岸美元母公司层面发放。需要逐项确认的条款有：授予股数和完全稀释总股本、行权价、成熟期（常见 4 年、1 年 cliff）、离职后的行权窗口，以及回购条款。

## 面试将围绕项目深挖、客服 Agent 设计和创始人的“测试信仰”

哪里都查不到 Jekka 或西格莫伊德的面经，Glassdoor、Blind、脉脉、看准和牛客上也没有员工或候选人的评价。面试流程只能参照同类岗位推断。

2025–2026 年的面经显示，大厂 Agent 岗通常是 2–4 轮技术面加一轮 HR 面。阿里一面“偏基础：Java 八股 + Redis + MySQL + 分布式（即使是 Agent 岗）”，二面转向 Agent 设计、RAG 和项目深挖 ([卡码笔记](https://notes.kamacoder.com/interview/llm/))。百度文心一言团队的三轮依次考基础、实践思维和全局视野 ([知乎](https://zhuanlan.zhihu.com/p/1946655041625760922))。初创公司的流程更短。盛大旗下一家深度研究公司的 Agent 岗只有三轮，第二轮是 HR 加 CEO，“聊的全是 AI 实战”；上机题是用 vibe-coding 改造一个开源项目并在本地跑通。作者的教训是，面试官会不停追问“为什么”，照搬 AI 输出或别人的设计，一问就露馅 ([V2EX](https://www.v2ex.com/t/1218676))。题库项目还整理了 1–2 小时到 4–6 小时不等的限时作业，例如“智能文档问答 Agent”和“AI Code Review Agent” ([agent-interview-hub](https://github.com/Zchary1106/agent-interview-hub))。

据此推断，Jekka 的流程大致是：简历筛选或 HR 电话，一到两轮以项目深挖和客服 Agent 系统设计为主的技术面，可能有一道小型上机题或带回家作业，一轮联合创始人面，最后由 HR 谈 offer。面试语言是中文、英文还是混合，需要提前问清。

题型上，一篇 2026 年覆盖网易、阿里、腾讯、字节四家 Agent 岗的面经，标题直言“不背八股了” ([掘金](https://juejin.cn/post/7675928689989222440))。字节的面试官会拿着你的架构图，指着某个节点追问，典型问法是“你的 Agent 调了三个工具就死循环了，异常处理在哪写的？” ([掘金](https://juejin.cn/post/7674870309703319567))。阿里被点名的题目包括：用 trace 拆解定位瓶颈并量化收益，RAG 召回与幻觉治理，以及“AI 客服 Agent 项目如何设计” ([面灵AI](https://www.mianlingai.com/topics/ai-agent-interview-questions-2026/))。题库里，“从 0 到 1 设计智能客服 Agent 并写出完整技术方案”是高频题，追问会落到工具幻觉、“任务幻觉”（没调工具却声称已完成）以及怎样量化幻觉率 ([CSDN](https://agent.csdn.net/6a6c715710ee7a33f294da47.html))。面向架构师的题库更看重平台能力，比如百万级并发会话调度、长任务的状态持久化与断点续跑、工具市场的权限设计。它把面试官的关注点总结为三件事：“你有没有真做过；你有没有权衡意识；你有没有兜底思维” ([CSDN](https://adg.csdn.net/6a45004810ee7a33f28571fd.html))。评测类问题也很常见：Agent 评测为什么比 LLM 评测难，LLM-as-a-Judge 有哪些优势和偏差，上线后怎样监测回归和行为漂移 ([hello-agents](https://github.com/datawhalechina/hello-agents/blob/main/Extra-Chapter/Extra01-%E9%9D%A2%E8%AF%95%E9%97%AE%E9%A2%98%E6%80%BB%E7%BB%93.md))。

反复出现的还有一组概念辨析题：Workflow 与 Agent 怎么选，MCP、Function Call 与 A2A 有何区别，为什么手写 Agent 而不用框架，以及 Prompt Caching 怎么用 ([卡码笔记](https://notes.kamacoder.com/interview/llm/); [面灵AI](https://www.mianlingai.com/topics/llm-agent-interview-questions-2026/))。第一题可以借 Anthropic 的划分作答：Workflow 走预先定义的代码路径，Agent 由模型自己决定下一步，能用简单代码解决的就先不上框架 ([Anthropic](https://www.anthropic.com/engineering/building-effective-agents))。记忆题会问上下文溢出怎么办、长期记忆如何避免“记忆污染”；多智能体题会问何时拆分、如何防止死锁，以及 Supervisor、对等和分层三种模式 ([知乎](https://zhuanlan.zhihu.com/p/1994727642969167003))。字节还被点名问过如何防止网页里的恶意指令注入 Agent ([面灵AI](https://www.mianlingai.com/topics/ai-agent-interview-questions-2026/))。练习可以用两个能直接打开的 GitHub 题库：AgentGuide 收录 52 道 Agent 系统题和 45 道含系统设计的开发岗专项题 ([AgentGuide](https://github.com/adongwanai/AgentGuide))，agent-interview-100 单列了评测与生产两个模块 ([agent-interview-100](https://github.com/BigKunLun/agent-interview-100))。

那道“从 0 到 1 设计智能客服 Agent”的高频题值得按固定顺序准备。下表是一个答题骨架，由上述题库和后文的厂商实践综合而成，属于推断，不来自任何面经。

| 步骤 | 要讲清的内容 |
|---|---|
| 1. 先定指标 | 解决率（转人工绝不算“已解决”）、政策违规率、转人工率、CSAT、p50/p95 延迟、每次解决成本 |
| 2. SOP 建模 | SOP 是带版本的状态图，节点包括意图、槽位收集、校验、动作和确认；模型只负责节点内的理解和措辞，状态转移、前置条件，以及退款上限、退货窗口、身份核验这类硬规则写在代码里 |
| 3. 事实来源 | 订单、物流、库存来自类型化的工具调用；参数做 schema 校验并保证幂等，设超时与重试；RPA 只作兜底 |
| 4. 检索 | 商品、政策和 FAQ 按商户隔离，支持热更新 |
| 5. 输出校验 | 价格、库存、发货日期和政策类说法必须能追溯到工具结果或检索片段，否则拦截或改写 |
| 6. 转人工 | 按风险分级触发，交接时附上摘要和已做的动作 |
| 7. 多渠道 | IM、邮件、语音各有适配层，共用同一个 SOP 引擎 |
| 8. 可观测性 | 逐轮记录状态、检索内容和工具的输入输出 |
| 9. 发布 | 离线回归 → 影子流量 → 灰度 → 按商户逐步放量 |

如果被追问评测，就按“数据来源（生产失败案例、商户 SOP、模拟用户、红队集）→ 标签（期望终态、必做与禁止的动作）→ 判分（确定性检查优先，其次是经人工校准的 LLM 裁判，分歧交人工复核）→ 层次（组件、轨迹、端到端）→ 每个场景的 pass^k → CI 与按商户的发布门禁 → 录制回放与版本对比”的顺序展开。面向架构师的追问则会落到多租户规模、按商户的 SOP 版本管理、中国、美国和东南亚之间的数据隔离、跨会话跨渠道的工单状态、平台限流，以及自研还是用 LangGraph 一类框架。

有两条经验值得记住。一位有 5 年经验的候选人发现，**做过微调的人通过率更高** ([知乎](https://zhuanlan.zhihu.com/p/1928735725647562675))。一篇字节一面的失败复盘则说，很多人挂在讲不清项目的背景、痛点和量化效果 ([CSDN](https://blog.csdn.net/l01011_/article/details/159677903))。Jekka 自称有自研模型，所以 Transformer、微调和解码这类基础题在早期轮次仍会考到一些，但对架构岗大概率不是重点。

创始人面最难准备，但并非无迹可寻。联合创始人 Aaron 在《此话当真》播客中反复强调了几件事。这档播客由真格基金出品，而真格是官网列出的投资方，所以下面这些都是公司自述，不是独立报道 ([小宇宙](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437); [jekka.ai](https://jekka.ai/))。下表把这些主题和可能的追问对应起来。

| 创始人公开强调 | 面试中可能的追问 | 回答要落到的证据 |
|---|---|---|
| AI 靠不靠谱，取决于**最差情况下的稳定性和方差控制**，而不是偶尔的上限 ([53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html)) | 同一个场景跑 8 次，你的 Agent 能全过几次？方差从哪来，怎么压？ | pass^k 数据；低温度和结构化输出；决策交给代码；录制回放 |
| 在大模型之上自研“**类神经网络的控制结构**”，出错时可以**白盒调试**，快速定位根因 ([搜狐](https://m.sohu.com/a/948536090_355029/)) | 一个错误回答，你怎么判断是意图、槽位、检索、工具还是措辞出了问题？ | 逐轮、逐节点的 trace；修复后沉淀为回归用例 |
| “Jekka 团队里 90% 的人都在搭建测试集、测试流程和测试工具” ([Podwise](https://podwise.ai/dashboard/episodes/5698963)) | 从零搭一套客服评测：数据从哪来？谁来判分？怎么接进 CI？ | 生产失败案例挖掘、SOP 场景化、模拟用户；确定性断言优先，LLM 裁判要与人工校准 |
| 宣称“零幻觉”、99%+ 准确率、80%+ 独立解决率 ([jekka.ai](https://jekka.ai/); [小宇宙](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437)) | 幻觉怎么分类？“零”的边界在哪里？ | 分类方法；每千轮幻觉数；范围外拒答或转人工 |
| 收费按使用量计、与实际结果挂钩，因为每次运行都消耗 token ([53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html)) | 一次“解决”成本多少？成本和质量怎么取舍？ | 把每请求成本遥测扩展成每次解决成本；模型路由与缓存 |
| “99% 的泡沫都来自对 Scaling Laws 的过度迷信” ([Podwise](https://podwise.ai/dashboard/episodes/5698963)) | 你怎么看“更大的模型”和“更好的控制结构”？ | 拿数据说话，不选边站：引用显式策略控制让小模型胜过大模型的研究 |
| 拥有能提供真人级 AI 的底层模型能力，是与其他 Agent 公司最大的区别 ([Podwise](https://podwise.ai/dashboard/episodes/5698963)) | 什么时候该微调而不是改提示？生产对话怎么变成训练数据？ | 蒸馏小模型降延迟和成本；数据权属与合规 |

有两处细节值得提前想清楚。第一，Aaron 说长 SOP 已经不是难点，因为模型的上下文窗口足够长 ([小宇宙](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437))。可见他眼中的难题不是“记住流程”，而是“每次都按流程走”。答题时重心应放在方差和越界处理上，长上下文技巧是次要的。第二，公司自称每天处理数百万次交互、消耗数亿 token ([53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html))，折合每次交互约 10² 量级，也就是几十到几百个 token。创始人还有另一种说法，“每天十万甚至百万轮对话、电话交互” ([53AI](https://www.53ai.com/news/zhinengkefu/2025102892538.html))，按它算则是 10²–10⁴，两种口径本身就对不上。按前一种口径，一个常规 Agent 每轮都要带上系统提示、SOP 和检索内容，这个数字明显偏低。合理的解释有几种：提示极度精简、大量命中缓存、主要流量由小模型承接，或者这只是粗略取整。这道算术可以当作一个好奇的问题提出，例如“按公开报道估算，每次交互只有几百个 token，你们是怎么做到的？”，并说明数字来自二手报道。这样既能展示对成本结构的敏感，又不会显得在质疑对方。创始人面也会考判断力。他对 Scaling Laws 立场鲜明，最稳妥的回应是拿测试数据说话，既不附和，也不刻意唱反调。

## 胜任岗位需要吃透五块客服 Agent 硬知识

2025–2026 年头部厂商的共识可以浓缩成一句话：**大模型负责理解和语言，代码负责决策和数字，用模型检查模型，上线前先过仿真**。Jekka 的“控制结构”“白盒调试”和“零幻觉”都可以放在这个框架里理解。

### SOP 控制：让模型在状态图里工作，硬规则写进代码

主流做法是先用自然语言写业务流程，再把它编译进确定性的框架里执行。Decagon 的 Agent Operating Procedures（AOP）结合了“自然语言的灵活性与代码的精确和严谨”，用来取代难以维护的决策树 ([Decagon](https://decagon.ai/blog/from-sops-to-agent-operating-procedures))。Intercom Fin 的 Procedures 支持分支、数据连接器和**代码片段**：代码片段用于必须“绝对准确、相同输入必须得到相同输出”的环节，审批和转人工的位置设有检查点 ([Intercom](https://www.intercom.com/blog/procedures-simulations-updates))。Sierra 明确规定硬政策由确定性逻辑执行，例如退换货窗口是 30 天，Agent 就“永远不应该”为超出窗口的订单办理换货 ([Sierra](https://sierra.ai/blog/ai-agents-guide))。它的单个 Agent 由 15 个以上模型组成，检索、分类、工具、政策、语气等子任务各选合适的模型 ([Sierra](https://sierra.ai/blog/constellation-of-models))。开源的 Rasa CALM 走得更远：大模型只输出“启动某流程”“设置某槽位”这类命令，业务逻辑由确定性的 FlowPolicy 执行 ([Rasa](https://rasa.com/docs/learn/concepts/calm/))。

研究结果支持这条路线。StateFlow 把任务建模为状态机，在 InterCode SQL 和 ALFWorld 上的成功率比 ReAct 分别高 13% 和 28%，成本只有后者的 1/5 和 1/3 ([arXiv](https://arxiv.org/abs/2403.11322))。FlowAgent 在每步决策前后各加一个控制器，既保证合规，又能处理流程外的问题 ([arXiv](https://arxiv.org/pdf/2502.14345))。EACL 2026 的 JourneyBench 用 703 段模拟对话测量政策遵从度，发现显式建模策略控制能提高遵从度，**小模型配上这种设计可以胜过大模型** ([ACL Anthology](https://preview.aclanthology.org/credits/2026.eacl-industry.15))。国内厂商说法不同，思路一致，网易七鱼的最佳实践是“小模型标准流程、大模型辅助判断、人工关键节点确认” ([网易智企](https://grow.163.com/cms/9C2rlCWC.html))。

“类神经网络的控制结构”最可信的技术解读，来自一条把 Agent 流水线当作可优化计算图的研究线。GPTSwarm 把 Agent 看成由节点（大模型推理或工具调用）和边组成的图，用节点优化器改提示词，用边优化器增删连接 ([PMLR](https://proceedings.mlr.press/v235/zhuge24a.html))。TextGrad 把大模型的自然语言批评当作“梯度”反向传播，逐个修正组件 ([arXiv](https://arxiv.org/abs/2406.07496))。DSPy Assertions 在约束不满足时回溯重试 ([arXiv](https://arxiv.org/abs/2312.13382))。按这个思路推断，Jekka 的控制层是一张分层图，节点都很窄且输入输出有明确类型，包括意图识别、槽位抽取、政策校验、检索、回复规划、回复生成和校验。每个节点的输入输出都有日志，这是“白盒调试”成立的前提。至于 Jekka‑Markov，若“Markov”取其字面含义，则指下一个状态只取决于当前状态和结构化的槽位信息。没有任何公开资料描述过 Jekka 的内部架构，以上只是根据命名和公开表述做的猜测，面试时应当作问题提出，不能当作事实陈述。

“自研模型”这条线也有行业参照。2026 年的新动向是有规模的厂商用自家对话数据做垂直后训练。Intercom 2026 年 3 月发布的 Fin Apex 1.0 针对客服任务、政策和升级行为做了后训练 ([Intercom](https://intercom.com/blog/announcing-fin-apex-the-age-of-vertical-models-is-here))，有报道称其解决率为 73.1%，高于 GPT-5.4 的 71.1%，但这一数字未经核实 ([Archyde](https://www.archyde.com/intercom-launches-fin-apex-1-0-ai-model-outperforming-openai-and-anthropic/))。PolyAI 的语音模型 Raven 靠量化和前缀缓存压低首 token 延迟，并借助用户模拟器在完整的仿真对话上做强化微调 ([PolyAI](https://poly.ai/blog/polyai-raven-v2-large-language-model); [PolyAI](https://poly.ai/blog/reinforcement-fine-tuning-for-voice-agents))。Sierra 在现成模型做不好的子任务上换用微调模型 ([Sierra](https://sierra.ai/blog/constellation-of-models))，Rasa CALM 则专为小型微调模型优化 ([Rasa](https://rasa.com/docs/learn/concepts/calm/))。据此，“什么时候该微调”的一个站得住的回答是（推断）：硬规则和数字交给代码；高频、窄口径、对延迟和成本敏感的节点，比如意图和槽位，用蒸馏或微调的小模型；训练数据来自生产失败案例和仿真对话。Jekka‑Markov 很可能也走这条路线，面试时可以顺势追问。

### 幻觉治理：先分类，再把“零”限定在可验证的动作空间

回答幻觉问题，先要有分类。题库把工具幻觉和“任务幻觉”列为高频追问 ([CSDN](https://agent.csdn.net/6a6c715710ee7a33f294da47.html))。客服场景可以进一步细分为五类：商品与事实错误、政策幻觉（承诺不允许的退款）、工具幻觉（参数错误或捏造工具）、任务幻觉（声称做了实际没做的动作），以及数值与结构错误。

防线是分层的。OpenAI 的 Agent 构建指南把护栏拆成相关性分类器、安全分类器、PII 过滤、按风险分级的工具保护、规则检查和输出校验；失败次数超过阈值或要执行高风险动作时，引入人工 ([OpenAI](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf); [openarchitect 摘要](https://openarchitect.ai/technical-summary-openais-practical-guide-to-building-ai-agents/))。Sierra 用并行运行的“监督者”在生成过程中核对事实、执行政策，再由确定性规则扫描敏感数据。它也承认，监督者本身就是 Agent，带着同样的局限 ([Sierra](https://sierra.ai/blog/confidence-in-every-conversation); [Sierra](https://sierra.ai/blog/defense-in-depth-in-the-age-of-agents))。NVIDIA 的方案给每条回复打可信度分，不达标就走兜底回复或转人工 ([NVIDIA](https://developer.nvidia.com/blog/prevent-llm-hallucinations-with-the-cleanlab-trustworthy-language-model-in-nvidia-nemo-guardrails))。Fin 还专门训练了一个“升级检测”模型来判断何时转人工 ([Intercom](https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained))。

转人工要单独设计，不能只当作兜底。触发条件包括用户明确要求、连续多次意图识别失败或置信度低、负面情绪、敏感或法律话题、大额退款这类高风险动作，以及工具或系统故障 ([CSDN](https://damodev.csdn.net/6985620454b52172bc5a32cc.html); [YoTradeApi](https://blog.yotradeapi.com/blog/ai-customer-support-workflow/))。交接应是“热转接”，附上一份结构化摘要：客户是谁、为什么来、AI 试过什么、为什么升级 ([Vida](https://vida.io/blog/ai-agent-human-handoff); [Cresta](https://cresta.com/guides/ai-to-human-agent-handoff-best-practices))；不专门设计的话，AI 升级默认就是冷转接 ([Twilio](https://www.twilio.com/en-us/blog/insights/ai-to-human-handoff-context))。上线后要跟踪转接后的 CSAT 和再次升级率 ([Vida](https://vida.io/blog/ai-agent-human-handoff))，把每次转人工沉淀为评测用例，并把转人工率与解决率分开报告。在抖店上，转人工还直接关系到店铺考核，后文平台部分会讲到。

讲约束解码时要说清它的边界。XGrammar-2 让所测的 Llama 模型在 BFCL-v3 上的 schema 合法率都达到 100%，加了约束的 3B 模型甚至胜过不加约束的 70B 模型 ([arXiv](https://arxiv.org/pdf/2601.04426))。但作者明确说，它只保证**格式**，不保证语义 ([MLC 博客](https://blog.mlc.ai/2026/05/04/xgrammar-2-fast-customizable-structured-generation))。

对 Jekka 的“零幻觉”，面试中最好的姿态既不是附和也不是否定，而是给出一个工程上站得住的定义。Heisenberg 的“32 位浮点、零幻觉”和哆哆的“100% 零幻觉”都是营销用语 ([jekka.ai](https://jekka.ai/); [jekkaduoduo.com](https://www.jekkaduoduo.com/))。合理的技术解读是：价格、折扣、库存、发货日期这类数字和事实从不由模型生成，而是由代码从平台 API 精确取值后填进回复；再由校验器拦下任何没有依据的说法；超出范围的问题一律拒答或转人工。另一款同样宣传“零幻觉”的模型 Jev 就被评论者指出，它的“零幻觉”其实只是没有类型或结构错误 ([X @vista8](https://x.com/vista8/status/2100775218830815554))。可见这个词的定义一定要追问。计量上，应该按类别统计生产抽检样本中的每千轮幻觉数，报告尾部和最差情况，而且永远不把转人工算作“已解决”。Intercom 社区里就有商家抱怨，人工提前介入时 Fin 仍“假定已解决”，在按解决量计费的模式下虚增了数字 ([Intercom 社区](https://community.intercom.com/ask-the-intercom-team-about-fin-54/fin-s-flawed-assumed-resolved-pricing-design-8929))。

### 评测与回归：用 pass^k 和终态断言定义“靠谱”

这一块与 Jekka 关系最密切。Sierra 2024 年发布的 τ-bench 用模拟用户、领域政策文档和工具 API 来测 Agent，**只有数据库终态符合政策要求才算成功**。它还引入了 pass^k，即 k 次独立试验全部成功的概率。当时 GPT-4o 级别的 Agent 任务成功率不到 50%，零售场景的 pass^8 不到 25% ([arXiv](https://arxiv.org/pdf/2406.12045))。2025 年的 τ²-bench 加入“双控制”的电信场景，用户也要在自己的设备上动手操作；GPT-4.1 的 pass^1 从零售场景的 74% 掉到电信场景的 34% ([arXiv](https://arxiv.org/pdf/2506.07982))。电商客服里引导买家在 App 里取消订单、上传照片、确认收货，正属于这种更难的模式。到 2026 年，文本场景已接近饱和，顶级模型在电信场景的 pass^1 约为 99% ([llm-stats](https://llm-stats.com/benchmarks/tau2-telecom))，前沿转向了语音。τ-Voice 显示，文本模式的 GPT-5 成功率为 85%，语音 Agent 在干净音频下只有 31%–51%，加入噪音和口音后降到 26%–38% ([arXiv](https://arxiv.org/abs/2603.13686))。Anthropic 的评测指南说得更直接：面向客户的 Agent 应该看 pass^k；单次成功率 75% 时，pass^3 只有约 42% ([ai-eval.org](https://ai-eval.org/deep-dive/anthropic-demystifying-evals-for-ai-agents))。这正是 Aaron 所说“方差控制”的数学表达。单次成功率 95% 的 Agent，连续 5 次全对的概率只有约 77%；要抬高 pass^k，降低方差比提高平均能力见效更快。

厂商已经把仿真做成了发布门禁。Sierra 允许团队规定仿真必须通过才能进入生产 ([Sierra](https://sierra.ai/blog/release-governance-guardrails-for-agents-at-scale))。Fin 每次修改 Procedure 都会跑仿真，建议每个 Procedure 按意图和数据状态写 5–10 个脚本化仿真 ([Intercom](https://www.intercom.com/help/en/articles/15304795-how-to-build-a-fin-procedure-that-improves-over-time))。Decagon 用 Watchtower 自动审查仿真结果，并在生产环境中持续监控；它的 Trace View 能把延迟拆到每个微步骤 ([Decagon](https://decagon.ai/blog/decagon-simulations); [Decagon](https://decagon.ai/resources/decagon-trace-view))。Parloa 让一个模型扮演来电者、另一个运行 Agent，再用确定性检查加 LLM 裁判打分 ([OpenAI](https://openai.com/index/parloa/))。

LLM 裁判不能直接信。2026 年的研究发现，逐条打分的 LLM 裁判与人工评分只有中等相关，需要用一小组人工标注的锚点样本加校准函数来修正 ([arXiv](https://arxiv.org/html/2609.29431v1))。在语音 Agent 测试中，“没有任何 LLM 裁判能追平人工准确率” ([arXiv](https://arxiv.org/html/2608.24314))。

一套可信的电商客服回归体系可以分五层（推断）：

| 层次 | 做法 |
|---|---|
| 脚本化仿真 | 按“意图 × 数据状态”编写，数据状态如未付款、已发货、已签收、已退款，以及是否在退货期内 |
| 生产回放 | 回放真实对话，mock 平台 API |
| 终态断言 | 检查订单和退款的状态变更是否符合预期 |
| LLM 裁判 | 只评语气和帮助程度，且经过人工校准 |
| 上线门禁 | 用 5–8 个随机种子计算 pass^k，不达标不上线 |

### 语音链路：800 毫秒预算里，端点检测是最大变量

企业客服的默认语音架构仍是**级联式**：流式 ASR → 大模型 → 流式 TTS。原因是转写文本、策略校验、组件可替换和工具调用的可靠性更重要。Sierra 把每一轮拆成端点检测、推理和合成三个延迟关键环节。它专门训练了适应嘈杂、多人说话音频的 VAD，把反应延迟缩短了“数百毫秒”；又把推理改成并发图，让滥用检测、检索和 API 调用并行，并预先计算最可能的下一步。它也可以用语音到语音模型合并步骤，但在企业场景优先保证可靠性、能力和可观测性 ([Sierra](https://sierra.ai/blog/voice-latency))。

| 环节 | 典型数值 | 来源 |
|---|---|---|
| 端点检测（判断用户说完） | 200–800 ms，优化后 200–400 ms | [Hamming](https://hamming.ai/resources/voice-ai-latency-whats-fast-whats-slow-how-to-fix-it) |
| 单轮示例（端点 80 + ASR 120 + 大模型首 token 180 + TTS 首音 70） | 约 450 ms（p50），不含网络和电话链路 | [Fora Soft](https://www.forasoft.com/blog/article/livekit-ai-agents-guide) |
| TTS 首音（独立单日实测） | ElevenLabs Flash 185 ms，Cartesia Sonic 3.6 为 440 ms | [FutureAGI](https://futureagi.com/blog/elevenlabs-vs-cartesia-tts-2026/) |
| 端到端（第三方每个平台实测 500 通） | 中位数约 680–850 ms，差于厂商宣称 | [Telnyx](https://telnyx.com/resources/voice-ai-agents-compared-latency) |
| 推测式生成 | 中位数 667 ms，未启用时为 1,513 ms（观察性数据） | [arXiv](https://arxiv.org/pdf/2603.29893) |

语音链路的故障主要出在四处。回声消除失败是误打断和自我打断循环的主要原因 ([Picovoice](https://picovoice.ai/guide/voice-agents/common-failure-modes/))，生产目标是说话重叠低于 200 ms、误打断率低于 5% ([Hamming](https://hamming.ai/resources/voice-agent-interruption-handling-runbook))。多数企业电话仍是 **8 kHz 的 G.711 窄带音频**，丢失了大量声学细节，而听错一个数字就能让身份验证或支付流程中断 ([Kore.ai](https://www.kore.ai/blog/voice-ai-challenges-and-how-to-fix))。端点判断也是难点：等太久显得迟钝，切太早会打断用户。LiveKit 新的音频型轮次检测器结合语义和韵律，启用后最小和最大端点延迟从 0.5 秒和 3.0 秒降到 0.3 秒和 2.5 秒 ([LiveKit](https://docs.livekit.io/agents/logic/turns/turn-detector/))。

国内语音栈要熟悉三类方案。火山引擎对话式 AI 是 RTC 加豆包 ASR、大模型、TTS 的级联方案，宣称响应“低至 1s”，用回声消除加深度学习处理双方同时说话 ([火山引擎](https://www.volcengine.com/docs/6360/1330208))。阿里云百炼的 Qwen 实时语音支持 Function Calling，并提供声学 VAD、语义断句和手动三种轮次检测 ([阿里云](https://help.aliyun.com/zh/model-studio/qwen-audio-realtime-user-guides))。阶跃星辰开源的 Step-Audio 2 是端到端模型，支持语音原生的工具调用 ([Hugging Face](https://huggingface.co/stepfun-ai/Step-Audio-2-mini))。

面试时可以给出这样一个站得住的设计（推断）：电话经 SIP 或 RTC 接入流式 ASR，配语义加声学的端点模型；文本和语音共用同一个 SOP 控制器；TTS 按句流式输出，问候语和确认语预先合成并缓存；调用工具期间先说一句“我帮您查一下订单”；订单号和手机号用复述或按键确认；目标是首音 p50 低于 800 ms、p95 低于 1.5 秒。中文场景还有“在吗”“发货没”这类极短语句，更适合用语义断句，而不是只看静音时长。

语音的回归同样要靠仿真。Sierra 的 Voice Sims 从带目标、情绪、语言和耐心程度的虚拟用户出发，合成语音并混入背景噪音，再送进生产语音链路，同时统计沉默、打断和抢话，并按时间汇总延迟与错误率，以便在升级 Agent 时发现回归 ([Sierra](https://sierra.ai/blog/how-voice-sims-work); [Sierra](https://sierra.ai/blog/voice-sims-test-agents-in-real-world-conditions-before-they-talk-to-your-customers))。第三方指出，Parloa 的仿真用的是合成来电者而不是真实电话音频，噪音和口音测试要另配工具 ([testmu](https://www.testmuai.com/blog/parloa-agent-testing/))。

### 平台集成：每个平台的接口、限流和考核指标都不一样

架构上需要三层：最底下是一层**渠道适配**，把各平台的消息统一成内部事件格式；中间是按平台区分的工具层，提供订单、物流、退货资格、优惠券等工具，并各自管理限流预算；最上面是共享的 SOP 控制器和评测体系。各平台差别很大，下表概括主要约束。

| 平台 | 接口与限制 | 考核指标与风险 |
|---|---|---|
| Shopee | Chat API 能拉取会话、发送回复，并通过 webhook 接收新消息；需要单独的 OAuth 权限范围，可能要向平台申请开通 ([API2Cart](https://api2cart.com/api-technology/shopee-api/)) | 违规批量发送会被限制 ([API2Cart](https://api2cart.com/api-technology/shopee-api/))；聊天回复率影响优选卖家资格，门槛说法不一，其中一种是 12 小时内回复率达 90% ([BigSeller](https://www.bigseller.pro/blog/articleDetails/2996/How-to-Become-a-Preferred-Seller-on-Shopee-%26-Lazada%3A-A-Step-by-Step-Guide.htm)) |
| Shopify | GraphQL Admin API 按查询成本点数限流：标准店每秒 100 点，Plus 每秒 1,000 点，单次查询上限 1,000 点 ([Shopify.dev](https://shopify.dev/docs/apps/build/apis/graphql-admin/rate-limits))；2026 年 1 月与 Google 共同发布 Universal Commerce Protocol；另有每店一个的 Storefront MCP 和跨店检索的 Catalog MCP，2026 年 3 月起美国合格商家默认开通 Agentic Storefronts ([Shopify](https://www.shopify.com/news/spring-26-edition-dev)) | 导购类 Agent 可以直接调用标准化的商品和购物车工具 |
| 抖店飞鸽 | 公开渠道查不到第三方 IM 接口文档；有开发者用浏览器自动化加载飞鸽网页工作台，既脆弱又有合规风险 ([CSDN](https://blog.csdn.net/zgyulongfei/article/details/140960430))；抖音电商在扣子上开源了售后客服 Agent 模板 ([CSDN/火山引擎](https://blog.csdn.net/volcenginetod/article/details/147729294)) | 据报道，2026 年 7 月起商家体验分改看“飞鸽人工平均响应时长”，未回复会话按 10 分钟计 ([搜狐](https://www.sohu.com/a/1050748200_121385614))；机器人回复是否计入，说法不一 |
| 有赞云 | 有专门的客服 API 类目 ([有赞云](https://doc.youzanyun.com/list/API/1298)) | 按套餐限额，A 套餐每月 50 万次 API 调用和 50 万条消息 ([有赞云](https://doc.youzanyun.com/resource/doc/8770)) |

这些考核指标说明，在 Shopee 和抖店上，AI 客服的价值有一部分是**守住店铺指标**。回复延迟的服务目标，以及在考核窗口到期前安全转给人工，都是产品需求，不是锦上添花。可观测性方面可以引用 OpenTelemetry 的 GenAI 语义约定，它定义了 gen_ai.* 属性和 invoke_agent、execute_tool 等 span，但它目前是否已正式稳定，各方说法不一 ([TrueFoundry](https://www.truefoundry.com/blog/opentelemetry-genai-semantic-conventions))。

## 测试与成本经验对得上，语音、电商平台和年限缺口最大

按 README，提问者是纽约大学在读硕士，自述喜欢从模型、数据、API、测试到部署，端到端负责整个问题。最有分量的证据是 **VideoSense Agent**：一个面向视频库的对话式 Agent，在工具调用循环中推理，用可播放的片段和图表回答问题，**已在生产环境运行，带每请求成本遥测和 146 个测试** ([VideoSense Agent](https://github.com/kenny0312/videosense-agent))。第二项是 **SocialLens**，用真实的 Gemini 流水线从原始短视频生成消费者洞察看板，内容包括情绪驱动因素、热度、用户画像和片段级证据 ([SocialLens](https://kenny0312.github.io/social-video-insights/))。此外还有两个项目：基于自监督特征图做视觉导航的 DINOv2-GraphNAV，以及在视频流中做实时人脸识别的 face_detect。README 没有写全职工作年限和毕业时间，也没有提到语音、电话、电商平台、中国平台 API、微调或多租户系统方面的经历。下面的匹配分析以此为界。

| Jekka 岗位需求 | 提问者已有的证据 | 匹配度 | 补齐方式 |
|---|---|---|---|
| 评测、测试与回归体系 | VideoSense 的 146 个测试（README 未说明是否包含 Agent 行为评测） | 较强，待证实 | 先把测试按单元、集成、行为评测分层，再补 pass^k、模拟用户和终态断言 |
| 成本控制与按结果计费 | 每请求成本遥测 | 强 | 扩展到“每次解决成本”和模型路由 |
| 工具调用层、失败处理、可观测性 | 生产环境中的工具调用循环 | 较强 | 画出逐节点的失败处理图，讲清重试、超时与兜底 |
| SOP 控制与有实际后果的操作（退款、改单） | 开放域工具调用，不涉及退款、改单类流程 | 部分 | 做一个状态机驱动的售后 Agent 小样 |
| 多模态内容理解（商品视频、买家照片） | SocialLens 的 Gemini 视频流水线 | 部分 | 讲成“把商品视频和买家照片变成结构化知识”的迁移 |
| 语音与电话链路 | 无（face_detect 处理的是视频流，不是音频） | 缺口大 | 做流式语音 demo 并实测延迟 |
| 中国及跨境电商平台集成 | 无 | 缺口大 | 研读 Shopee、Shopify、有赞文档，写一份渠道适配设计 |
| 百万级会话、多租户、SOP 版本管理 | 单一产品的生产系统 | 缺口 | 准备“规模扩大 100 倍时我会改什么” |
| 自研模型与微调 | README 未提及 | 缺口 | 补齐何时微调、模型蒸馏和数据飞轮的论述 |
| 架构师头衔所需年限与带队经验 | 在读硕士，年限未写明 | 缺口大 | 以“核心 Agent 工程师”定位应聘 |

有一点要诚实面对：README 没有说明这 146 个测试覆盖哪些层次。面试前要自己梳理清楚，哪些是确定性的单元测试和集成测试，哪些是对 Agent 行为的评测。Jekka 关心的是后者，而且是以 pass^k 衡量的后者。

最现实的定位是“带架构所有权的核心 Agent 工程师”，而不是去对标要求 5–10 年经验的架构师。按大厂标准，年限明显不够。不过初创公司的“架构师”多半只是职责范围的标签。猎聘与清华的报告显示，自 2025 年三季度起入门级需求下降、专家级需求上升，这对年限不足的在读硕士是逆风；在这样的市场里，VideoSense 这类上线证据是拉开差距的少数筹码之一（推断），毕业后的硕士学历能满足多份 JD 的学历门槛，但这些 JD（如顺丰）往往同时要求 5–10 年经验，学历本身构不成优势。还要先明确自己的毕业届别，向 HR 确认按校招还是社招流程走、职级怎么定：Jekka 唯一能确认的招聘渠道就是一张校招雇主页，而校招和社招对应的薪酬区间相差很大。前程无忧的数据显示，校招雇主最看重数学与算法基础（60.3%），其次才是真实项目、实习或竞赛（52.5%） ([神州学人网](http://www.chisa.edu.cn/bussiness/202508/t20250826_2111382322.html))，走校招流程就不能只讲项目。谈判时，offer 应对标大厂应届 SP 或资深工程师的区间，而不是 5–10 年架构师的区间。如果公司坚持给架构师头衔，就要确认几件事：上面还有没有 CTO 或首席架构师，团队有多大，做的是平台还是交付。否则容易出现“头衔高、薪酬按新人、责任按资深”的错配。地点与签证的判断见薪酬一节：岗位大概率在杭州，美国签证担保希望很小（均为推断）。签约主体、能否远程、能否在新加坡（EP）或香港签约，都要直接问。后端八股也不能完全放下：2023 年那则疑似 Jekka 的帖子以 Python 后端为主，大厂 Agent 岗一面也照样考数据库和分布式，Python、数据库和分布式基础要过一遍。

下面是一个四周的准备计划，每一项都对应前文的一个考点。如果面试在两周之内，优先完成第 1 周和精简版的第 2 周，基础复习照常穿插。如果公司给了带回家作业，交付时一定附上测试和评测脚本，这正对创始人“测试优先”的胃口。

| 阶段 | 产出 | 对应考点 |
|---|---|---|
| 第 1 周 | 把 VideoSense 画成架构图，在每个节点标注失败处理、重试、超时与兜底；把 146 个测试按单元、集成、行为评测分层；对一组固定场景重复跑 5–8 次，算出 pass^k | 项目深挖、方差控制、白盒调试 |
| 第 2 周 | 做一个电商售后 SOP Agent 小样：“意图 → 槽位 → 校验 → 动作 → 确认”的状态机，mock 订单、物流和退款工具，把退货窗口和退款上限写成代码，配上用户模拟器、终态断言和 CI 门禁 | SOP 控制、幻觉治理、评测与回归 |
| 第 3 周 | 搭一个流式语音 demo：流式 ASR，复用同一个 SOP 控制器，按句流式 TTS，支持打断；实测“用户说完到首音”的 p50 和 p95，再加一组带噪音与打断的语音仿真回归 | 语音链路 |
| 第 4 周 | 写一页渠道适配与多租户设计（Shopee webhook、Shopify 成本限流、有赞配额、飞鸽合规、按商户的 SOP 版本与灰度发布）；估算每次解决的成本；准备一段用数据支撑的 Scaling Laws 观点 | 平台集成、规模、创始人面 |
| 贯穿四周 | 每天约 1 小时打基础：Transformer、解码与 LoRA 微调要点，常见手撕题（Attention、LoRA、Agent Loop、工具参数校验）；Python、MySQL、Redis 与分布式；准备“何时微调而非改提示、如何蒸馏小模型降延迟和成本、生产对话如何变成训练数据”的回答，有余力就用 LoRA 微调一个小型意图分类器，对比延迟、成本和准确率 | 基础轮、自研模型与微调 |

面试也是双向尽调。下表列出应向公司核实的问题。在可检索范围内，Jekka 没有披露过任何一轮融资的轮次、金额或时间，官网只列出真格基金、云启资本和 Google for Startups 的标识 ([jekka.ai](https://jekka.ai/))；创始人只以“Aaron”之名出现 ([小宇宙](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437))；在招职位也查不到，只有那张 0 职位的校招雇主页。这些只能当面问。

| 应向公司核实的问题 | 为什么关键 | 好答案与危险信号 |
|---|---|---|
| 这个“Agent 架构师”具体负责什么：核心引擎、评测平台、语音，还是按客户交付？汇报给谁，团队多大，上面有没有 CTO 或首席架构师？ | 决定成长路径，也决定头衔是否名副其实 | 能说出 3 个月和 12 个月的成功标准算好；说不清是危险信号 |
| 能否提供书面 JD 和职级？按校招还是社招流程走？职级能否按核心工程师来定？ | 避免头衔、薪酬与责任错配 | 愿意书面确认是好信号 |
| 面试几轮？有没有带回家作业或现场编程？有没有创始人或 CTO 面？用什么语言？ | 公开渠道查不到任何 Jekka 面经 | HR 能说清流程和时间表算好 |
| 由哪个主体签约（杭州、新加坡、香港还是美国）？工作地点、远程政策、工作语言是什么？是否支持 H-1B、O-1 或新加坡 EP？ | 决定薪酬币种、期权归属和身份路径 | H-1B 数据库查不到 Jekka 雇主 ([MyVisaJobs](https://www.myvisajobs.com/employer/jenka-lab/))，默认按杭州岗位预期 |
| 现金结构：月薪多少，发几个月，年终是否保底？ | 标价与到手差距很大 | 年终不保底的“16 薪”要按 13 薪评估 |
| 期权：授予股数和完全稀释总股本、行权价、成熟期、离职后的行权窗口、回购条款、在哪个实体发放？ | 只给比例数字，没有意义 | 只说比例、不给条款是危险信号 |
| 处于哪个融资阶段，累计融了多少，现金能撑多久？国内与跨境业务各占多少，客户集中度如何？平台自带 AI 客服时怎么应对？2026 年为什么没有任何公开动态？ | 公开渠道查不到任何融资披露；平台既是渠道也是对手 | 愿意给出大致的现金跑道和收入结构是好信号 |
| “类神经网络的控制结构”是状态机、学习型路由还是校验器？SOP 状态由商户用自然语言写、自动编译，还是由解决方案工程师手工搭建？流程外的提问怎么处理？ | 判断技术含金量 | 能画出图、讲清节点职责算好 |
| Jekka‑Markov 是模型、运行时，还是两者都是？相对第三方基座，它是微调、蒸馏小模型还是分类器？生产对话是否用于训练，商户和买家的数据权属怎么处理？ | 判断“自研模型”的实际含义与合规边界 | 能说清基座、训练数据来源和授权方式算好 |
| “零幻觉”“99%+ 准确率”“80%+ 解决率”怎么定义、怎么测？Shopee 页面写的是 90%+ 解决率和 95%+ 回复准确率，哆哆官网写 70%+，口径为什么不一致 ([Shopee 服务市场](https://service.shopeecb.cn/software-support/2005/product-116); [jekkaduoduo.com](https://www.jekkaduoduo.com/))？生产抽检的幻觉率是多少？按结果计费时，“解决”怎么审计？ | 检验宣传和工程是否一致 | 能给出定义、分类和数据算好；只重复口号是危险信号 |
| 是否跟踪 pass^k 或最差情况指标？更换基座模型或修改 SOP 时，发布门禁是什么？评测集从哪来，LLM 裁判怎样与人工校准？ | 直接检验“九成人做测试”的说法 | 能讲出一次错误从工单到根因、修复、回归用例的完整路径 |
| 语音栈是级联还是端到端？延迟目标是多少？ASR、TTS 和电话接入是自研还是外采？ | 语音是提问者最大的技能缺口 | 有明确的 p50/p95 目标和实测数据 |
| 哪些平台走官方 API，哪些靠 RPA 或网页自动化？节目简介里“抖音、有赞首家官方模型提供商”的身份具体指什么 ([小宇宙](https://www.xiaoyuzhoufm.com/episode/68ff8d9101567203214ec437))？平台规则变化时，稳定性受多大影响？ | 合规与可靠性风险，也决定收入是否集中在少数平台 | 主要渠道走官方授权、平台合作能具体说明算好 |
| 大模型备案情况如何？法定代表人和股东是谁？ | 合规风险与实际控制人 | 后者可以自己在企查查或国家企业信用信息公示系统上核对 |

## 结论

没有公开 JD，对提问者反而是机会。在一家不公开招聘、靠内推和 App 流转的小公司，岗位边界往往是在面试中谈出来的。与其去对标一份不存在的架构师 JD，不如主动提出一个既吻合公司痛点、又与自己证据相称的职责范围：以评测回归体系（仿真、pass^k、发布门禁）为主要负责方向，同时参与 SOP 控制层开发，并确认上面是否还有 CTO 或首席架构师。创始人把难点放在最差情况而不是长 SOP 上，说明这份工作的本质是可靠性工程，不是提示词工程。准备因此应以测试基础设施和可度量的数字为主线，但不能放下模型基础。VideoSense 的 146 个测试和每请求成本遥测是这条主线的起点，其中有多少属于 Agent 行为评测，还要自己先梳理清楚。

往后看，有两个趋势值得提前押注。其一，文本客服的基准已接近饱和，而在 τ-Voice 首发时的测试里，语音 Agent 的成功率最多只有文本的六成。对一家文本加语音同栈的供应商，未来一年架构工作的重心很可能落在语音可靠性上，这恰是提问者最大的缺口，所以第 3 周的语音小样和语音仿真回归值得多投入时间（推断）。其二，有规模的厂商正在用自家对话日志和用户模拟器做垂直后训练，评测集和仿真器本身成了训练信号；如果 Jekka‑Markov 也走这条路，会搭评测的人同时就在给模型供数据（推断）。带进面试的实测数字是争取更高定级的有力证据（推断），但小样里的每次解决成本和语音延迟是 mock 环境下测的，要如实说明测量条件。
