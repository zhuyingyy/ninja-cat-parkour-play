# Standing idle PNG generation

Mode: built-in imagegen, reference-based identity edit. Original generated sheet was sliced into two frames; the neutral exterior matte was removed while retaining opaque enclosed face, P and sword pixels. PNGs were aligned in Figma to foot baseline y=659 without changing their 928×664 canvas.

## Generation prompt

Use case: identity-preserve. Asset type: transparent pixel-art game sprite sheet, exactly 2 cells in one horizontal row. Edit target/reference: supplied orange ninja cat. Produce a new STANDING IDLE pose of the EXACT same cat, matching its pixel texture, dark burgundy outline, orange/cream fur, royal-blue ninja suit, gold neck bell, and blue headband with a CLEAR WHITE CAPITAL LATIN LETTER 'P' (not a logo). Both feet planted side by side on the same ground baseline, torso upright relaxed, face three-quarter facing right, friendly alert expression. One hand holds same katana lowered diagonally down-right, tip safely above ground. Tail naturally curled on left; headband two loose cloth ends hang/curve left, no running or flying posture. Two cells: LEFT eyes open idle; RIGHT same character in IDENTICAL standing position but eyes closed in a cute blink, headband ends bent upward by just a few pixels. Head and body, sword, feet placement and size must be identical between cells. This is ONE sprite sheet, no text labels, grid, scenery, drop shadow, floor, checkerboard pattern, or UI. Genuine transparent alpha background with crisp clean contours, no fringe. Sheet dimensions 1856x664, each cell928x664. Maintain reference character head scale: head about410 pixels wide within each928px cell, total standing cat height about600px. Feet baseline y=644px. Body center x=464 in left cell and1392 in right cell; same baseline in both cells. Full character and sword contained inside each cell with transparent margins. Pixel art consistent with input, NOT vector illustration, not smooth cartoon. Preserve the clear P on both headbands.

## Alpha refinement prompt

Requested an actual RGBA alpha cutout preserving every character detail, removing the gray-and-white baked checkerboard. Final transparency was verified on the sliced PNGs.

