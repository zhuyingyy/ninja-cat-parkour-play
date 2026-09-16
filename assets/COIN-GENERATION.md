# P 金币

使用内置 imagegen 编辑原金币，加入白色像素 P。生成图的外部中性底纹在 PNG 导出时去除，保留金币内部白色字母和高光；成品为 248 × 280 RGBA PNG。

游戏显示为 62 × 70（此前 52 × 58），始终保持正面和固定宽度，用 1.8 秒周期的 ±5 px 轻微上下浮动表现动态。暂停冻结；减少动态效果时静止。

## Imagegen 提示词

Use case: precise-object-edit. Edit this existing pixel-art gold coin asset. Preserve its orange/gold palette, stepped dark-brown pixel outline, bright yellow-white rim highlight, slightly oval upright shape and retro pixel texture. Add one LARGE clear bold WHITE CAPITAL LATIN 'P' centered on the flat gold face, upright, clean pixel blocks, occupying about 45% of the inner face height. Letter must read exactly P, not a currency symbol. Retain space between the P and the glowing rim. Produce ONE isolated front-facing coin only, centered, full silhouette visible with a narrow even margin. No labels, scene, text other than P, no extra coins, no sparkles or shadow outside silhouette. Output a clean transparent PNG with actual alpha outside the coin. Never paint a checkerboard. If an opaque matte is required, use only perfectly flat pure magenta #FF00FF outside the coin, so it can be removed during asset export; no gradients or background texture. Preserve original crisp pixel art, no vector/smooth round icon redesign. Target sprite export 248x280 pixels.
