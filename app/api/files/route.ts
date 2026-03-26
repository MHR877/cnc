import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dirParam = searchParams.get("dir") || "";

    // Prevent directory traversal attacks
    const normalizedDir = path.normalize(dirParam).replace(/^(\.\.(\/|\\|$))+/, "");
    
    const baseDir = path.join(process.cwd(), "public", "files");
    const targetDir = path.join(baseDir, normalizedDir);

    // Ensure the target directory is within the base directory
    if (!targetDir.startsWith(baseDir)) {
      return NextResponse.json({ error: "Invalid directory" }, { status: 403 });
    }

    // Check if path exists
    try {
      await fs.access(targetDir);
    } catch {
      return NextResponse.json({ error: "Directory not found" }, { status: 404 });
    }

    // Get stats to ensure it's a directory
    const stat = await fs.stat(targetDir);
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: "Not a directory" }, { status: 400 });
    }

    const items = await fs.readdir(targetDir, { withFileTypes: true });

    const fileList = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(targetDir, item.name);
        const itemStat = await fs.stat(itemPath).catch(() => null);
        
        return {
          name: item.name,
          type: item.isDirectory() ? "directory" : "file",
          size: itemStat ? itemStat.size : 0,
          path: path.posix.join(normalizedDir.replace(/\\/g, '/'), item.name).replace(/^\//, '')
        };
      })
    );

    // Sort: directories first, then alphabetical
    fileList.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === "directory" ? -1 : 1;
    });

    return NextResponse.json({ files: fileList });
  } catch (error) {
    console.error("Error reading directory:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
