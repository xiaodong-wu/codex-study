# Codex 口语化教程

面向零编程基础读者的中文教程网站,现在分成两条路线:

1. **Codex 桌面端 App 教程**:偏图文、偏口语化,适合完全没有编程基础的人先上手。覆盖安装登录、项目/线程、Local/Worktree/Cloud、Review 面板、内置终端、浏览器标注、Computer Use、Appshots、自动化、技能、插件、MCP、设置、快捷键和安全边界。
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
- **页面 body 必须有两个 data 属性**:`data-title="..."` 用于顶栏面包屑;`data-chapter="..."` 用于左侧栏当前节高亮 + 完读 localStorage。首页和 404 可不设 `data-chapter`。
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

## 继续维护内容

打开对应的 `app/*.html`、`chapters/XX-name.html` 或 `appendix/*.html`,按下面的口径继续补案例、截图、提示词或官方功能更新。可以参考第 02/04/05/08/09 章、附录 A-D 和 App A0-A6 的写法:

- 每章 5-8 个 H2 小节
- 每章至少一个 `.exercise` 或 `.prompt-card`
- 每章末尾至少一个总结或下一步提示
- 口吻保持口语化:先讲“这东西干嘛用”,再讲“点哪里 / 怎么说”
- 涉及 Codex 功能、命令或入口变化时,优先核对 OpenAI Codex 官方手册

## 官方资料维护

App 教程内容参考 OpenAI Codex 官方手册,本次整理日期为 2026-06-23。Codex App 功能和入口会更新,维护时优先核对:

- Codex app features
- Codex app commands
- Codex app settings
- In-app browser
- Computer Use
- Automations
- Worktrees
- Review

## 部署上线

推荐用 Vercel:

1. 把整个目录推到 GitHub 仓库
2. Vercel Import 该仓库,Framework Preset 选 **Other**(纯静态)
3. Deploy。完成。
