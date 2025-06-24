const fs = require("fs");
const path = require("path");

const lessonsDir = path.join(__dirname, "lessons");
const lessonDirs = fs
  .readdirSync(lessonsDir)
  .filter((dir) => dir.startsWith("lesson"));

lessonDirs.forEach((lessonDir) => {
  const lessonPath = path.join(lessonsDir, lessonDir, "lesson.md");

  if (fs.existsSync(lessonPath)) {
    let content = fs.readFileSync(lessonPath, "utf8");

    // Добавляем горизонтальные разделители между основными разделами (## заголовки)
    content = content.replace(/\n## /g, "\n\n<!-- s -->\n\n## ");

    // Добавляем вертикальные разделители между подразделами (### заголовки)
    content = content.replace(/\n### /g, "\n\n<!-- v -->\n\n### ");

    // Убираем лишний разделитель в начале файла, если он есть
    content = content.replace(/^(---[\s\S]*?---\n\n)(<!-- s -->\n\n)/, "$1");

    fs.writeFileSync(lessonPath, content);
    console.log(`Added separators to ${lessonDir}/lesson.md`);
  } else {
    console.log(`File ${lessonPath} does not exist`);
  }
});

console.log("Separators added to all lesson files");
