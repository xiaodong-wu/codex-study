# Codex 中文教程

面向零编程基础读者的中文教程网站,现在分成两条路线:

1. **Codex 桌面端 App 教程**:偏图文、偏口语化,适合完全没有编程基础的人先上手。覆盖安装登录、项目/线程、Local/Worktree/Cloud、Worktree 隔离、Review 面板、内置终端、浏览器标注、Developer mode、Chrome、Computer Use、Appshots、图片生成、自动化、技能、插件、MCP、网页搜索、Memories、设置、快捷键和安全边界。
2. **Codex CLI 教程**:保留原来的终端路线,教读者用 OpenAI Codex CLI 做出可上线的产品官网。

## 本地预览

进入项目目录,起一个本地服务器:

```bash
cd /Users/wuxiaodong/Desktop/Codex教程
python3 -m http.server 8000
```

浏览器访问 <http://localhost:8000>。

> 必须用 HTTP server 打开,**不要双击 index.html**。共用 header/sidebar/footer 通过 `fetch()` 注入,在 `file://` 协议下会被浏览器拦截。

## 项目结构

```text
.
├── index.html                       双教程首页
├── 404.html
├── _headers                         Cloudflare Pages 响应头配置
├── wrangler.toml                    Cloudflare Pages / Wrangler 配置
├── app/                             Codex 桌面端 App 教程 7 章(A0-A6)
├── chapters/                        Codex CLI 教程 12 章(00-11)
├── appendix/                        附录 4 篇(A-D)
├── partials/                        全站共用 sidebar / header / footer
├── assets/
│   ├── css/                         base / layout / components / prose
│   ├── js/                          nav / progress / toc / code
│   └── img/                         章节示意图与截图素材
└── README.md
```

## 编辑约定

- **零构建**:纯 HTML/CSS/JS,无依赖,无打包器。
- **统一布局**:正文页都有 `<header id="site-header">`、`<aside id="sidebar">`、`<aside class="toc"><ul id="toc-list"></ul></aside>`、`<footer id="site-footer">` 四个空槽,由 `nav.js` 在客户端用 fetch 注入。
- **页面 body 建议保留两个 data 属性**:`data-title="..."` 用于页面语义标识;`data-chapter="..."` 用于左侧栏当前节高亮 + 完读 localStorage。首页和 404 可不设 `data-chapter`。
- **App 教程章节 ID**:使用 `app-00-overview`、`app-01-start` 这类值,并同步到 `partials/sidebar.html`。
- **代码块**:`.code > .code__bar (lang+copy) > pre`。
- **提示词卡片**:`.prompt-card > .prompt-card__head (label+copy) > .prompt-card__body > .prompt-card__note`。
- **图文说明**:App 教程优先使用 `assets/img/app/` 下的示意图。真实产品截图可能随版本变化,没有确定截图时用“示意图”并在图注里说明。

## 当前交付状态

完整 App 教程:
- App A0 · 先看懂 Codex 桌面端
- App A1 · 安装、登录和第一句话
- App A2 · 项目、线程和三种模式
- App A3 · 看改动、跑命令和保存
- App A4 · 浏览器、标注和电脑操作
- App A5 · 自动化、技能和外部工具
- App A6 · 设置、快捷键和安全边界

完整 CLI 正文章节:
- 第 00 章 · 写在前面
- 第 01 章 · 心态准备
- 第 02 章 · 把工具装到电脑里
- 第 03 章 · Codex 用法手册
- 第 04 章 · 口语化编程内功
- 第 05 章 · 搭出产品官网骨架
- 第 06 章 · 让它好看
- 第 07 章 · 当事情出错时
- 第 08 章 · 上线:让世界看到你
- 第 09 章 · 域名:给页面一个家
- 第 10 章 · 上线之后
- 第 11 章 · 进阶方向
- 附录 A · 口语化提示词模板库
- 附录 B · 术语小词典
- 附录 C · 命令速查表
- 附录 D · 常见踩坑全集

当前状态:App 教程、CLI 教程和附录都已扩写为完整正文版本。

本次 App 教程已做二次扩写:
- A0 增加界面四区读法、新手第一周范围和练习。
- A1 增加登录后检查、审批弹窗判断和第一次卡住时的提问方式。
- A2 增加线程生命周期、模式示例、Handoff、本地环境动作说明。
- A3 增加 Review 范围、行内评论流程、Staged/Unstaged、PR 评论、保存前检查。
- A4 增加内置浏览器入口、标注流程、Developer mode、Chrome 权限、Computer Use 设置、Appshots 步骤。
- A5 增加 Triage、耐用自动化提示词、技能/插件/MCP 选择表、AGENTS.md 示例。
- A6 增加推荐初始设置、命令菜单、权限范围、故障入口、Deep links 和设置体检。

本次最新功能补充:
- A0 增加 Codex 桌面端最新功能总览:Worktree、线程自动化、内置浏览器、Computer Use、Appshots、Skills、Memories。
- A2 补充 Worktree 隔离、后台任务、旧 Worktree 清理和 `.worktreeinclude` 的新手解释。
- A4 补充内置浏览器适用范围、Developer mode 调试边界、Computer Use 权限边界和 `$imagegen` 图片生成示例。
- A5 补充“自动化 + 技能”组合用法、MCP 共用配置提醒和网页搜索的官方资料核对提示词。
- A6 补充 Profile、Appearance、Pets、Personalization、Context-aware suggestions、Memories、Web search、Appshots hotkey 和更多快捷键。

## 继续维护内容

打开对应的 `app/*.html`、`chapters/XX-name.html` 或 `appendix/*.html`,按下面的口径继续补案例、截图、提示词或官方功能更新。可以参考第 02/04/05/08/09 章、附录 A-D 和 App A0-A6 的写法:

- 每章 5-8 个 H2 小节
- 每章至少一个 `.exercise` 或 `.prompt-card`
- 每章末尾至少一个总结或下一步提示
- 口吻保持口语化:先讲“这东西干嘛用”,再讲“点哪里 / 怎么说”
- 涉及 Codex 功能、命令或入口变化时,优先核对 OpenAI Codex 官方手册

## 官方资料维护

App 教程内容参考 OpenAI Codex 官方文档,本次整理日期为 2026-06-23。Codex App 功能和入口会更新,维护时优先核对:

- Codex app features: <https://developers.openai.com/codex/app/features>
- Codex app commands: <https://developers.openai.com/codex/app/commands>
- Codex app settings: <https://developers.openai.com/codex/app/settings>
- In-app browser: <https://developers.openai.com/codex/app/browser>
- Computer Use: <https://developers.openai.com/codex/app/computer-use>
- Automations: <https://developers.openai.com/codex/app/automations>
- Worktrees: <https://developers.openai.com/codex/app/worktrees>
- Review: <https://developers.openai.com/codex/app/review>
- Windows app: <https://developers.openai.com/codex/app/windows>
- Appshots: <https://developers.openai.com/codex/app/appshots>

## 部署上线:Cloudflare Pages 免费方案

这个项目已经按 Cloudflare Pages 做了项目级配置:

- `wrangler.toml`:项目名是 `codex-study`,输出目录是仓库根目录 `.`。
- `_headers`:给静态资源加长期缓存,给全站加基础安全响应头。
- 无 `package.json`,无构建步骤,是纯 HTML/CSS/JS 静态站。

### 方式一:GitHub 连接 Cloudflare Pages(推荐)

适合长期维护。以后只要 push 到 GitHub,Cloudflare Pages 就会自动重新部署。

1. 先把代码推到 GitHub 仓库,例如:

```bash
git remote -v
git push origin main
```

2. 打开 Cloudflare Dashboard。
3. 进入 **Workers & Pages**。
4. 选择 **Pages**。
5. 点击 **Create application / Create project**。
6. 选择 **Connect to Git**。
7. 选择 GitHub,授权 Cloudflare 访问仓库。
8. 选择仓库: `xiaodong-wu/codex-study`。
9. 构建设置按下面填写:

| 字段 | 填法 |
| --- | --- |
| Project name | `codex-study` |
| Production branch | `main` |
| Framework preset | `None` / `Other` |
| Build command | 留空 |
| Build output directory | `/` |
| Root directory | 留空 |

10. 点击 **Save and Deploy**。
11. 部署成功后,Cloudflare 会给一个类似 `https://codex-study.pages.dev` 的公开链接。

> Cloudflare 官方说明里提到:没有框架也可以部署 Pages;没有构建步骤时,Build command 可以留空。构建输出目录就是要上传为网站内容的目录。

### 方式二:Wrangler 直接上传(可选)

适合临时部署或测试。长期维护仍然推荐 GitHub 连接方式。

第一次先登录:

```bash
npx wrangler login
```

然后在项目根目录执行:

```bash
npx wrangler pages deploy . --project-name=codex-study --branch=main
```

如果项目还没创建,Wrangler 会提示你创建 Pages 项目。部署成功后也会得到一个 `pages.dev` 链接。

### 以后怎么更新

平时改完内容后:

```bash
git status
git add .
git commit -m "Update tutorial content"
git push origin main
```

Cloudflare Pages 会自动检测 GitHub 的新提交并重新部署。

### 常见问题

- **Cloudflare 看不到仓库**:回到 GitHub 授权页面,确认 Cloudflare Pages 有权限访问 `xiaodong-wu/codex-study`。
- **部署失败,提示找不到输出目录**:确认 Build output directory 是 `/`,不是 `dist` 或 `public`。
- **页面样式没更新**:先强制刷新浏览器。项目里 CSS/JS 已带版本号,通常不会长时间吃旧缓存。
- **左侧目录加载不出来**:线上一般不会有这个问题。本地预览时必须用 `python3 -m http.server 8000`,不要直接双击 HTML。

### 官方文档

- Cloudflare Pages Git integration: <https://developers.cloudflare.com/pages/get-started/git-integration/>
- Cloudflare Pages Direct Upload: <https://developers.cloudflare.com/pages/get-started/direct-upload/>
- Cloudflare Pages Build configuration: <https://developers.cloudflare.com/pages/configuration/build-configuration/>
- Cloudflare Pages Wrangler configuration: <https://developers.cloudflare.com/pages/functions/wrangler-configuration/>
