/** Simplified Chinese copy for the BookmarkUp site. Missing keys fall back to
 *  English. Machine-assisted draft - native review welcome. */
export default {
  // Meta / nav
  navFeatures: "功能",
  navHow: "工作原理",
  navFaq: "常见问题",
  navGithub: "GitHub",
  themeLabel: "主题",
  themeSystem: "跟随系统",
  themeLight: "浅色",
  themeDark: "深色",
  langLabel: "语言",

  // Hero
  heroTagline: "只需左键单击，即可在新标签页中打开任意书签。",
  heroSub:
    "一款面向 Chromium 浏览器的轻量、私密的 Manifest V3 扩展。当前标签页永不移动 - 页面不变、滚动位置不变，甚至输入到一半的文字也在。",
  ctaInstall: "安装",
  ctaGithub: "在 GitHub 上查看",
  heroNote: "免费且开源。无账户，无跟踪。",

  // Features
  featuresTitle: "它能做什么",
  f1Title: "左键单击，新标签页",
  f1Body:
    "直接使用书签栏中已有的书签即可，无需养成新习惯。",
  f2Title: "标签页原地不动",
  f2Body:
    "你所在的页面被冻结在原处 - 不刷新、不闪烁 - 因此未保存的输入和滚动位置都得以保留。",
  f3Title: "中键单击不变",
  f3Body: "中键单击和 Ctrl+单击的行为与以往完全一致。",
  f4Title: "可搜索的弹出窗口",
  f4Body:
    "工具栏弹出窗口（Ctrl+Shift+U）列出所有书签。输入即可筛选，方向键移动，回车打开。",
  f5Title: "精细控制",
  f5Body:
    "可为整个书签栏、单个书签、单个搜索引擎或同站链接切换新标签页行为。",
  f6Title: "主题与语言",
  f6Body:
    "浅色、深色或跟随系统主题，界面提供 12 种语言，并跟随你的浏览器。",

  // How it works
  howTitle: "工作原理",
  howIntro:
    "浏览器栏无法直接挂钩，因此 BookmarkUp 让书签本身无法导航，再替你打开真正的页面。",
  how1Title: "1. 标记",
  how1Body:
    "受管理的书签网址会获得一个极小的隐形标记。它仍指向同一站点，并且完全可逆。",
  how2Title: "2. 原地停留",
  how2Body:
    "一条规则会将被标记的点击重定向到一个返回 HTTP 204 的空白页面，因此当前标签页永不跳转。",
  how3Title: "3. 打开",
  how3Body:
    "扩展检测到点击，去掉标记，并在新标签页中打开真正的页面。",

  // Screenshots
  shotsTitle: "看一看",
  shotPopup: "书签弹出窗口",
  shotSettings: "设置",

  // Privacy
  privacyTitle: "隐私优先",
  privacy1: "无账户、无跟踪、无分析。不收集也不出售任何内容。",
  privacy2:
    "你的书签仅为显示和打开而读取，绝不会上传。",
  privacy3:
    "打开一个书签只会发出一个空的、无内容的网络请求，不携带你的任何数据。",

  // Install
  installTitle: "安装",
  installIntro:
    "Chrome 网上应用店的发布正在筹备中。在此期间，可直接从 GitHub 安装：",
  install1: "下载最新发布的 ZIP 并解压。",
  install2: "打开浏览器的扩展页面并开启开发者模式。",
  install3: "点击“加载已解压的扩展程序”，选择解压后的文件夹。",
  install4: "固定 BookmarkUp，然后开始左键单击你的书签。",
  installReq: "适用于 Chromium 浏览器，版本 116 或更高。",

  // FAQ
  faqTitle: "常见问题",
  q1: "支持哪些浏览器？",
  a1: "任何基于 Chromium 的浏览器（Chrome、Brave、Edge 等），版本 116 或更高。",
  q2: "它会改动我的书签吗？",
  a2:
    "它会给书签链接添加一个很小的隐形标签，以识别你的点击。这完全可逆 - 移除扩展会先还原原始书签。",
  q3: "会收集我的数据吗？",
  a3: "不会。无账户、跟踪或分析。你的书签绝不会离开你的设备。",
  q4: "为什么非要在新标签页打开？",
  a4:
    "这样左键单击就绝不会丢失你所在的页面。你也可以在设置中，将任意书签、搜索引擎或同站链接改回在当前标签页打开。",
  q5: "如何移除它？",
  a5:
    "在设置中使用“删除扩展” - 它会还原你的原始书签、清除已保存的设置并卸载自身。",

  // Footer
  footerTagline: "只需左键单击，即可在新标签页中打开任意书签。",
  footerRepo: "代码仓库",
  footerIssues: "问题",
  footerDiscussions: "讨论",
  footerReleases: "发布",
  footerSupport: "支持我们 (Ko-fi)",
  footerLicense: "MIT 许可证",
};
