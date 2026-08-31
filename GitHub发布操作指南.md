# 专业版 GitHub 发布操作指南

> 目标：在 github.com 新建独立仓库 family-items-pro，与普通版（family-items）分开。
> 你的电脑已装 git（2.55），github.com 可访问。

## 第一步：在 GitHub 网页创建空仓库

1. 浏览器打开 https://github.com/new
2. Repository name 填：**family-items-pro**
3. 选择 **Public**（个人使用免费，Pages 需要 Public）
4. **不要**勾选 Add a README file（保持全空，避免冲突）
5. 点 **Create repository**
6. 创建后复制仓库地址备用：https://github.com/gxxiong6696/family-items-pro.git

## 第二步：配置 git 身份（只需一次）

打开 PowerShell，逐行执行：

```
git config --global user.name "gxxiong6696"
git config --global user.email "你的GitHub邮箱"
```

## 第三步：上传专业版

逐行执行（整段复制粘贴也可以）：

```
cd "D:\家庭物品管理系统\专业版-github发布包"
git init
git add .
git commit -m "专业版 V4.1 首发：原图存储、提醒中心三分类、跨版兼容包"
git branch -M main
git remote add origin https://github.com/gxxiong6696/family-items-pro.git
git push -u origin main
```

> push 时会弹 GitHub 登录窗口 → 浏览器授权登录即可。
> 若提示输密码：GitHub 已不支持账号密码，需用 Token。生成方法：
> GitHub → 右上角头像 → Settings → Developer settings → Personal access tokens →
> Tokens (classic) → Generate new token → 勾选 repo → 生成后把 token 当密码粘贴。

## 第四步：开启在线访问（Pages）

1. 打开 https://github.com/gxxiong6696/family-items-pro/settings/pages
2. Source 选 **Deploy from a branch** → Branch 选 **main** → 目录 **/ (root)** → Save
3. 等 1-2 分钟，在线地址：
   **https://gxxiong6696.github.io/family-items-pro/**
4. 手机浏览器打开 → 添加到主屏幕 → 当 App 用（专业版网页版）

## 第五步（可选）：上传 APK 到 Releases

1. 打开 https://github.com/gxxiong6696/family-items-pro/releases/new
2. Tag 填 **v4.1**，标题填 **专业版 V4.1**
3. 拖入文件：D:\家庭物品管理系统\家庭物品管理系统-专业版-V4.1.apk
4. 点 **Publish release**

## 以后更新版本

源码更新后（发布包同步），重复：

```
cd "D:\家庭物品管理系统\专业版-github发布包"
git add .
git commit -m "更新说明"
git push
```

## 安全须知

- 发布包已检查：只含 index.html / sw.js / manifest.json / icons / README，**无私钥、无注册码生成器**
- 含私钥的「注册码生成器.html」永远不要放进这个目录
- 普通版仓库（family-items）与本仓库互相独立，Pages 地址各自分发
