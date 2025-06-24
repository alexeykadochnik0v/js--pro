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

    // Добавляем кавычки к метаданным
    content = content.replace(
      /^---\s*\ntitle:\s*(.+)\s*\ndescription:\s*(.+)\s*\n---/m,
      '---\ntitle: "$1"\ndescription: "$2"\n---'
    );

    fs.writeFileSync(lessonPath, content);
    console.log(`Added quotes to metadata in ${lessonDir}/lesson.md`);
  } else {
    console.log(`File ${lessonPath} does not exist`);
  }
});

console.log("Quotes added to metadata in all lesson files");
