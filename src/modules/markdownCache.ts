/**
 * MinerU Markdown 缓存管理模块
 * 使用 Zotero 文件 API 进行文件操作
 */

/**
 * 获取缓存目录路径
 */
function getCacheDir(): string {
  const zoteroDataDir = Zotero.DataDirectory.dir;
  // PathUtils 是目前最新的推荐标准
  const cacheDir = PathUtils.join(zoteroDataDir, "marginmind");
  // console.log("cacheDir", cacheDir);
  return cacheDir;
}

/**
 * 确保缓存目录存在
 */
async function ensureCacheDir(): Promise<void> {
  const cacheDir = getCacheDir();
  // 检查是否存在，不存在则创建
  if (!(await IOUtils.exists(cacheDir))) {
    await IOUtils.makeDirectory(cacheDir);
    // console.log("Cache directory created at:", cacheDir);
  }
}

/**
 * 根据 attachmentItemID 生成缓存文件路径
 */
function getCacheFilePath(attachmentItemID: number): string {
  const fileName = `${attachmentItemID}.md`;
  // 使用 PathUtils.join 自动处理系统斜杠
  return PathUtils.join(getCacheDir(), fileName);
}

/**
 * 同步检查是否存在缓存
 */
export function hasCache(attachmentItemID: number): boolean {
  const cachePath = getCacheFilePath(attachmentItemID);
  try {
    const file = Zotero.File.pathToFile(cachePath);
    return file.exists();
  } catch {
    return false;
  }
}

/**
 * 异步检查是否存在缓存
 */
export async function hasCacheAsync(
  attachmentItemID: number,
): Promise<boolean> {
  const cachePath = getCacheFilePath(attachmentItemID);
  return await IOUtils.exists(cachePath);
}

/**
 * 异步读取缓存的 markdown
 */
export async function readCache(
  attachmentItemID: number,
): Promise<string | null> {
  const cachePath = getCacheFilePath(attachmentItemID);
  if (!(await IOUtils.exists(cachePath))) {
    return null;
  }
  const content = await IOUtils.readUTF8(cachePath);
  return content;
}

/**
 * 同步读取缓存（用于需要同步的场景）
 */
export function readCacheSync(attachmentItemID: number): string | null {
  const cachePath = getCacheFilePath(attachmentItemID);
  try {
    const file = Zotero.File.pathToFile(cachePath);
    if (!file.exists()) {
      return null;
    }
    return Zotero.File.getContents(file) as string;
  } catch {
    return null;
  }
}

/**
 * 异步写入缓存
 */
export async function writeCache(
  attachmentItemID: number,
  markdown: string,
): Promise<void> {
  try {
    await ensureCacheDir();
    const cachePath = getCacheFilePath(attachmentItemID);
    await IOUtils.writeUTF8(cachePath, markdown);
  } catch (err) {
    console.error(`Failed to write cache for item ${attachmentItemID}:`, err);
    throw err;
  }
}

/**
 * 删除缓存
 */
export async function deleteCache(attachmentItemID: number): Promise<boolean> {
  const cachePath = getCacheFilePath(attachmentItemID);
  if (await IOUtils.exists(cachePath)) {
    await IOUtils.remove(cachePath);
    return true;
  }
  return false;
}

/**
 * 获取所有缓存文件信息
 */
export async function listCacheFiles(): Promise<
  Array<{
    id: string;
    name: string;
    size: number;
    modified: Date;
  }>
> {
  const cacheDir = getCacheDir();
  const files: Array<{
    id: string;
    name: string;
    size: number;
    modified: Date;
  }> = [];

  if (!(await IOUtils.exists(cacheDir))) {
    return files;
  }

  try {
    const entries = await IOUtils.getChildren(cacheDir);

    for (const entryPath of entries) {
      const entry = entryPath.split(/[/\\]/).pop() || "";
      if (!entry.endsWith(".md")) continue;

      try {
        const stat = await IOUtils.stat(entryPath);
        if (!stat) continue;

        // 尝试从 Zotero 获取文献标题
        const id = entry.replace(".md", "");
        let name = entry;
        // console.log("name", name);

        try {
          const item = Zotero.Items.get(parseInt(id, 10));
          if (item) {
            name = item.parentItem?.getField("title") || entry;
          }
        } catch {
          // 忽略错误
        }

        files.push({
          id,
          name,
          size: stat.size ?? 0,
          modified:
            stat.lastModified != null
              ? new Date(stat.lastModified)
              : new Date(),
        });
      } catch {
        // 忽略单个文件的错误
      }
    }
  } catch {
    // 忽略目录读取错误
  }

  return files;
}

/**
 * 批量删除缓存
 */
export async function deleteCaches(
  attachmentItemIDs: number[],
): Promise<number> {
  let deleted = 0;
  for (const id of attachmentItemIDs) {
    if (await deleteCache(id)) {
      deleted++;
    }
  }
  return deleted;
}

/**
 * 清空所有缓存
 */
export async function clearAllCache(): Promise<number> {
  const cacheDir = getCacheDir();
  if (!(await IOUtils.exists(cacheDir))) {
    return 0;
  }

  try {
    const entries = await IOUtils.getChildren(cacheDir);
    let deleted = 0;

    for (const entryPath of entries) {
      const entry = entryPath.split(/[/\\]/).pop() || "";
      if (!entry.endsWith(".md")) continue;

      try {
        await IOUtils.remove(entryPath);
        deleted++;
      } catch {
        // 忽略单个文件的删除错误
      }
    }

    return deleted;
  } catch {
    return 0;
  }
}
