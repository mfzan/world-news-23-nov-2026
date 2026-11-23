// The World — Monday, 23 November 2026, as one image.
//
// Runs under Node 22 with the standard library only. It takes the front
// page this repository holds (entry.png) and hands it to the grader at
// /output/entry.png.
//
// The page sums up the day in the winning newspaper form: COP31 collapsing
// in Antalya with no deal, the Democrats clinching 258 House seats, and
// Trump, Putin and Xi meeting in Shenzhen lead the page; thirty-three more
// stories across seven regions fill it out, with a world map marking the
// four flashpoints, a UTC timeline and a date check. Thirty-six stories in
// all, and the date — Monday 23 November 2026 — printed on it.
//
// The gate only takes a whole PNG or JPEG of at most 1 MiB and 1024 by
// 1024 pixels, so this program measures the file from its own header and
// refuses to hand in anything over either limit. The copy is left
// world-readable (0644): the grader collects the output as another user.
//
// Outside the grader's container, set MAKEFUN_OUTPUT_DIR to stand in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const BYTE_CAP = 1048576;
const SIDE_CAP = 1024;

function main() {
  const root = path.dirname(fileURLToPath(import.meta.url));
  const input = path.join(root, "entry.png");
  const destDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const dest = path.join(destDir, "entry.png");

  const bytes = fs.readFileSync(input);
  if (bytes.length > BYTE_CAP) {
    throw new Error(
      `entry.png is ${bytes.length} bytes, over the ${BYTE_CAP} byte cap`,
    );
  }
  const size = imageSize(bytes);
  if (size.w > SIDE_CAP || size.h > SIDE_CAP) {
    throw new Error(
      `entry.png is ${size.w}x${size.h}, over the ${SIDE_CAP} pixel cap`,
    );
  }

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(input, dest);
  fs.chmodSync(dest, 0o644);
}

// Pixel size from the file's own header, without a decoder.
function imageSize(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    // PNG: the IHDR chunk holds width then height as 4-byte words.
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf[0] !== 0xff || buf[1] !== 0xd8) {
    throw new Error("entry.png is neither a PNG nor a JPEG");
  }
  // JPEG: step through the segments until a frame header (SOF0/SOF2).
  let off = 2;
  for (;;) {
    if (buf[off] !== 0xff) {
      off += 1;
      continue;
    }
    const marker = buf[off + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      return { w: buf.readUInt16BE(off + 7), h: buf.readUInt16BE(off + 5) };
    }
    off += 2 + buf.readUInt16BE(off + 2);
  }
}

main();
