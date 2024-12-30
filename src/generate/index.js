import path from 'path';
import fs from 'fs';
export function generate() {
    const dir = path.join(__dirname, '../views/commonFiles'); // 更新路径
    console.log('Running cleanup script...');
    // 检查文件夹是否存在并删除
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Deleted ${dir}`);
    } else {
        console.log(`${dir} does not exist.`);
    }
}