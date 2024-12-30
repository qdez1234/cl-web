import path from 'path';
import fs from 'fs';

export function generate() {
    const dir = path.join(__dirname, '../views/commonFiles'); // 更新路径
    const mainDir = path.join(dir, 'main');

    console.log('Running cleanup script...');

    // 检查文件夹是否存在并删除
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Deleted ${dir}`);
    } else {
        console.log(`${dir} does not exist.`);
    }

    // 创建新的 commonFiles 文件夹及其子文件夹
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(mainDir, { recursive: true });

    // 在 main 文件夹下生成 100 个 .vue 文件
    for (let i = 1; i <= 100; i++) {
        const mainFileName = `common${i}.vue`;
        const mainFilePath = path.join(mainDir, mainFileName);
        const mainFileContent = `<template>
<ex-render/>
</template>

<script>
export default {
   name: 'common${i}_main'
}
</script>
`;
        fs.writeFileSync(mainFilePath, mainFileContent);

    }
    console.log('writeFile commonFiles');

}
