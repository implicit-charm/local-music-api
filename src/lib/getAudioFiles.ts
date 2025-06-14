// src/utils/getAudioFiles.ts
import fs from "fs";
import path from "path";

const audioDirectory = path.join(__dirname, "../../public/audio");

const extractBeforeFirstDash = (str: string): string => {
  const index = str.indexOf("-");
  return index === -1 ? str : str.substring(0, index);
};

export const getAudioFiles = () => {
  try {
    const files = fs.readdirSync(audioDirectory);
    const audioFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".mp3", ".wav", ".ogg"].includes(ext);
    });

    return audioFiles.map((file) => {
      const filePath = path.join(audioDirectory, file);
      const stats = fs.statSync(filePath);
      const baseName = path.basename(file, path.extname(file));

      // 查找同名的 .lrc 文件
      const lrcFileName = `${baseName}.lrc`;
      const lrcFilePath = path.join(audioDirectory, lrcFileName);
      const hasLrcFile = fs.existsSync(lrcFilePath);

      return {
        name: extractBeforeFirstDash(file),
        relativePath: `/audio/${file}`,
        lrcRelativePath: hasLrcFile ? `/audio/${lrcFileName}` : "",
        size: stats.size,
      };
    });
  } catch (error) {
    console.error("Error reading audio directory:", error);
    return [];
  }
};
