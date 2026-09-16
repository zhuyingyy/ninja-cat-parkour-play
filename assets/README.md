# 高清透明 PNG · 替换说明

游戏画布固定为 **780 × 1644**。原有独立素材共 **19 张**，均为真实 RGBA 透明 PNG，并在 Figma 设置 **4× 导出**。背景单独存放。

[Figma 高清 PNG 切图区](https://www.figma.com/design/xpuoOZoA84HwlqJiRdNpyS/game?node-id=326-1678)

## 怎么替换

1. 选中 Figma 中同名 PNG 切图框，使用已设置的 4× PNG 导出。
2. 覆盖项目 `assets/png/` 同名文件；保留宽高、透明通道和脚底对齐位置。
3. 刷新游戏。PNG 像素尺寸提升不会改变页面的显示尺寸。

Figma 内全部切图为图片填充，无需编辑矢量。Figma 导出后需要手动覆盖本地文件，不会自动同步。

## 实际 PNG 像素尺寸

- `cat-run.png`、`cat-jump.png`：928 × 664；游戏显示 232 × 166。原姿势保留作参考和跳跃；奔跑使用 motion/ 内六张新姿势。
- `portrait.png`：764 × 648。
- `logo.png`：1920 × 344。
- `subtitle.png`：1760 × 140；`points.png`：448 × 112。
- `jump-button.png`、`jump-button-pressed.png`：2840 × 680。
- `pause.png`、`sound-on.png`、`sound-off.png`：384 × 384。
- `heart.png`：168 × 152。
- `digits.png`：1600 × 208；数字 0–9 横向排列，每格 160 × 208。
- `coin.png`：248 × 280。
- `bag.png`：1040 × 1200。
- `daruma.png`：304 × 264，游戏显示 76 × 66，悬浮小鬼达摩。
- `crate.png`：464 × 368，游戏显示 82 × 60，贴地木箱。
- `stone.png`：320 × 240，游戏显示 80 × 60，贴地石狮子。
- `shrine.png`：1720 × 1712。

角色、神社、按钮和道具使用高清原稿重切；轮廓去除了原背景及浅色残边。暂停、音效、生命、数字等简单 UI 图形重新输出为清晰 PNG。4× 指导出像素与 Figma 显示框的比例，不改变逻辑坐标。

## 背景文件

- `assets/backgrounds/background.png`：780 × 1644，完整夜景；不包含独立角色、神社或 UI。
- `assets/backgrounds/ground.png`：780 × 154，原静止页面地面；保留不覆盖。

两张背景都是完整不透明画面，存放在专门的背景区，不混入透明 PNG 专用包。旧低清切片已移出当前素材目录，并在 Figma 隐藏备份。

每项的 Figma 节点、显示尺寸、实际像素尺寸和路径都记录在 `manifest.json`。

## 新增分层与六帧奔跑

新增 12 张 PNG 位于 `motion/`，包括四层滚动背景、一张固定底部剪影、六张独立奔跑帧和一张可选横向图集。详见 [运动切图说明](motion/README.md)。原有切图区保持原样；新区域在 Figma 的 05 / Motion。

站立待机新增 `png/cat-idle.png` 与 `png/cat-idle-blink.png`，各 928 × 664，4× 透明 PNG，显示尺寸 232 × 166，脚底基线 y=659。游戏开始前切换眨眼并轻微呼吸；它们也包含在运动素材包中。

金币 `png/coin.png` 已加入白色像素 P，4× PNG 为 248 × 280，游戏显示 62 × 70。拾取金币始终正面显示白色 P，以约 1.8 秒周期上下浮动 ±5 px；暂停冻结，减少动态效果时静止。

## 粗像素反馈文字

- `digits.png`：1600 × 208，数字 0–9 横排，每格 160 × 208；右上角显示每位 40 × 52。
- `coin-gain.png`：160 × 104，+5 透明提示，显示 100 × 65。
- `hurt-warning.png`：376 × 104，日语「気をつけて！」透明提示，显示 235 × 65。
- 三者统一白字、深色粗描边、白色外边和底部阴影。

- `result-win.png` / `result-lose.png`：944 × 184，通关 / 失败弹窗像素标题；细化日文字形和字间距，显示约 400 × 78。
- 弹窗大号奖励数复用 `digits.png`，按位绘制，随实际奖励动态变化。
