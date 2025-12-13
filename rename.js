const fs = require('fs');
const path = require('path');

/**
 * 批量重命名文件夹内文件
 * @param {string} folderPath - 目标文件夹路径（绝对/相对）
 * @param {boolean} isDryRun - 试运行模式（仅打印操作，不实际重命名）
 */
function renameFiles(folderPath, isDryRun = true) {
  // 解析为绝对路径，避免相对路径歧义
  const absolutePath = path.resolve(folderPath);

  // 1. 校验文件夹是否存在
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ 错误：文件夹不存在 → ${absolutePath}`);
    return;
  }

  // 2. 读取文件夹内所有文件（过滤子文件夹）
  let files;
  try {
    files = fs.readdirSync(absolutePath, { withFileTypes: true })
      .filter(file => file.isFile()) // 只处理文件，排除文件夹
      .map(file => file.name);
  } catch (err) {
    console.error(`❌ 读取文件夹失败：${err.message}`);
    return;
  }

  if (files.length === 0) {
    console.log('ℹ️  文件夹内无文件可重命名');
    return;
  }

  // 3. 遍历文件并执行重命名
  files.forEach((oldName, index) => {
    // 获取文件扩展名（保留原格式）
    const ext = path.extname(oldName);
    // 新文件名：(索引) + 原扩展名（索引从 0 开始，可自行修改为 1）
    const newName = `(${index})${ext}`;
    
    const oldPath = path.join(absolutePath, oldName);
    const newPath = path.join(absolutePath, newName);

    // 避免重复命名覆盖（如果已存在同名文件则跳过）
    if (fs.existsSync(newPath)) {
      console.log(`⚠️  跳过：新文件名已存在 → ${newName}`);
      return;
    }

    // 试运行模式仅打印，实际模式执行重命名
    if (isDryRun) {
      console.log(`📝 试运行：${oldName} → ${newName}`);
    } else {
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ 成功：${oldName} → ${newName}`);
      } catch (err) {
        console.error(`❌ 失败：${oldName} → ${newName} | 原因：${err.message}`);
      }
    }
  });

  console.log(`\n📊 操作完成 | 总计文件数：${files.length} | 模式：${isDryRun ? '试运行' : '实际执行'}`);
}

// ====================== 配置区 ======================
// 替换为你的目标文件夹路径（相对/绝对均可）
const TARGET_FOLDER = './images'; 
// 试运行模式（true：只打印不修改；false：实际重命名）
const DRY_RUN = false; 
// ====================================================

// 执行主函数
renameFiles(TARGET_FOLDER, DRY_RUN);