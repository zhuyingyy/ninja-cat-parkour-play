# 障碍物：悬浮小鬼 + 贴地木箱 / 石狮子

使用内置 ImageGen，参考 cat-idle.png 的像素风。原生 RGBA 透明输出；裁掉透明边距、最近邻缩放、底部对齐后保存。

- daruma.png：304 × 264，游戏显示 76 × 66；替换原灯笼障碍。轻微左右摇摆。
- stone.png：320 × 240，游戏显示 80 × 60；替换原岩石为小鬼石像。
- crate.png：沿用木箱切图，游戏显示 82 × 60。
- 木箱与石狮子固定在地面 y=460；仅小鬼底部位于 y=426 / 432 / 438，错开悬浮高度，按游戏时间上下浮动 ±3；暂停时冻结，减少动态效果时固定；渲染与碰撞共用 entityY，游戏世界与画面比例为 1:1.5，碰撞高度分别 40 / 36 / 36，边缘留有余量。可单次跳跃越过，接触扣血，不可斩击。
- 原 lantern.png / rock.png 保留为旧素材备份，游戏不再引用。

## 小鬼达摩提示词

Use case: stylized-concept. Game-ready isolated pixel sprite for a cute Japanese ninja-cat side-scrolling runner. Attached cat is STYLE REFERENCE ONLY, do not depict the cat. Crisp chunky pixel clusters, thick dark outlines, limited warm highlights, no blurry brushwork, legible when displayed only 72x64 pixels. Frontal view with a tiny hint of top face, full object resting flat on ground, no ground/background itself, no floating pose, no large cast shadow. One centered object only, small transparent margins. True transparent RGBA PNG alpha background. Do not draw any checkerboard, text, numbers or UI. Subject: squat wide red-orange and plum-purple ONI DARUMA obstacle. Round low roly-poly body, two short cream horns, comically grumpy thick eyebrows, two small ivory fangs, cream face, red-orange body with subtle gold belly markings (no writing). Cute slightly mischievous, immediately reads as a monster obstacle, never a lantern or collectible. Width slightly greater than height. Pixel silhouette with a flat foot/base. Target exported canvas 304x264.

## 石像提示词

Use case: stylized-concept. Game-ready isolated pixel sprite for a cute Japanese ninja-cat side-scrolling runner. Attached cat is STYLE REFERENCE ONLY, do not depict the cat. Crisp chunky pixel clusters, thick dark outlines, limited warm highlights, no blurry brushwork, legible when displayed only 72x64 pixels. Frontal view with a tiny hint of top face, full object resting flat on ground, no ground/background itself, no floating pose, no large cast shadow. One centered object only, small transparent margins. True transparent RGBA PNG alpha background. Do not draw any checkerboard, text, numbers or UI. Subject: squat wide small carved stone ONI STATUE obstacle, like a chubby little stone guardian with short rounded horn nubs, a clearly carved grumpy face, warm amber small eyes, closed mouth, slightly chipped corners and a few cracks. Blue-slate and cool gray stone, dark navy outline, faint teal moss at base. Simple chunky shape with a flat broad grounded base. Cute not scary. Width greater than height, avoid tall monument. Target exported canvas 320x240.
