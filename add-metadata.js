const fs = require("fs");
const path = require("path");

const lessonsDir = path.join(__dirname, "lessons");
const lessonDirs = fs
  .readdirSync(lessonsDir)
  .filter((dir) => dir.startsWith("lesson") && dir !== "lesson01"); // Пропускаем lesson01, так как уже обработали

lessonDirs.forEach((lessonDir) => {
  const lessonPath = path.join(lessonsDir, lessonDir, "lesson.md");

  if (fs.existsSync(lessonPath)) {
    let content = fs.readFileSync(lessonPath, "utf8");

    // Извлекаем номер урока из имени директории
    const lessonNumber = lessonDir.replace("lesson", "");

    // Извлекаем заголовок из первой строки
    const titleMatch = content.match(/^# (.*)/);
    if (titleMatch) {
      const title = titleMatch[1];

      // Добавляем метаданные в начало файла
      const newContent = `---
title: Урок ${lessonNumber}
description: ${title}
---

${content}`;

      fs.writeFileSync(lessonPath, newContent);
      console.log(`Added metadata to ${lessonDir}/lesson.md`);
    } else {
      console.log(`Could not find title in ${lessonDir}/lesson.md`);
    }
  } else {
    console.log(`File ${lessonPath} does not exist`);
  }
});

console.log("Metadata added to all lesson files");
