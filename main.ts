// The World — Monday, 23 November 2026, as one image (Node 22, standard
// library only).
//
// The entry is a newspaper front page that sums up the day's world news:
// COP31 collapsing in Antalya with no deal, the Democrats clinching 258
// House seats, and Trump, Putin and Xi meeting in Shenzhen — plus 33 more
// stories across 7 regions, a world map with the four flashpoints marked,
// a UTC timeline and a date check. 36 stories in all, with the date,
// Monday 23 November 2026, printed on it.
//
// The front page was drawn in this session by render.py (Pillow + a flat
// world-map base): every headline is real text, so the page stays legible
// at 1024 pixels. The finished image lives beside this file as entry.png;
// this program's whole job is to hand it in, copying it to
// /output/entry.png where the judge reads it.
//
// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024
// pixels, and the judge sees exactly the bytes copied, so this program
// checks both limits before it copies and refuses to hand in a file the
// gate would refuse. The copy is left world-readable (mode 0644), because
// the grader collects the output as another user.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;

const here = fileURLToPath(new URL(".", import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

validateImage(source);
mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);
chmodSync(target, 0o644);

// Read a PNG or JPEG's pixel size from its own header, no decoder, and
// refuse anything over the gate's limits.
function validateImage(path) {
  const size = statSync(path).size;
  if (size > MAX_BYTES) {
    throw new Error(
      `entry.png is ${size} bytes, over the ${MAX_BYTES} byte cap`,
    );
  }
  const buf = readFileSync(path);
  const dims = readDimensions(buf);
  if (dims.width > MAX_SIDE || dims.height > MAX_SIDE) {
    throw new Error(
      `entry.png is ${dims.width}x${dims.height}, over the ${MAX_SIDE} pixel cap`,
    );
  }
}

function readDimensions(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    // PNG: width and height are the first two 4-byte words after the
    // 8-byte signature and the IHDR chunk header.
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    // JPEG: walk the markers until the frame header (SOF0/SOF2).
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    throw new Error("no JPEG frame header found in entry.png");
  }
  throw new Error("entry.png is neither a PNG nor a JPEG");
}
