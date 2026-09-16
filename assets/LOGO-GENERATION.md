# 忍者ポイントラン — 标题切图

使用内置 ImageGen 生成，参考原 logo.png 的奶油白字面、金色底部高光、橙红立体边及深棕像素描边。导出时移除生成背景的中性棋盘格，保留字面及透明通道。

- 文件：assets/png/logo.png
- PNG：1920 × 344，RGBA 透明
- 游戏显示：480 × 86，原位置不变
- Figma 切图：326:1719，4× PNG

## 生成提示词

Use case: text-localization. Create a replacement game title logo as a single isolated transparent PNG sprite, using the attached existing logo ONLY as style reference. Exact Japanese text, single horizontal line, left to right: 「忍者ポイントラン」 (no brackets). All eight characters must be precisely readable: 忍 者 ポ イ ン ト ラ ン. Cute chunky cartoon pixel-art Japanese display lettering, playful subtly bouncy baseline, cream white faces, warm golden lower highlights, red-orange dimensional lower edge, dark chocolate thick pixel outline, matching the current reference arcade ninja-cat game. Use block-stepped crisp edges and generous readable character counters. Make ポ dakuten/handakuten a clear small circle. No extra text, no English, no cat or moon or other decorations, no background or plaque. Wide composition around 5.58:1 with small transparent margins, intended to replace a 480x86 display logo, high resolution about 1920x344 or wider. True RGBA transparency, never draw a checkerboard or background. Entire title fully visible, no cut-off strokes.
