import { parse } from 'yaml';
import * as path from 'path';
import * as fs from 'fs';
import { createHash } from 'crypto';

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

// 读取项目配置
export const getConfig = () => {
  const environment = getEnv();
  const yamlPath = path.join(process.cwd(), `./.config/.${environment}.yaml`);
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  return config;
};

export const checkNullObj = (obj: object): boolean => {
  if (obj == null) return true;
  return Object.keys(obj).length === 0;
};

// md5加密
export const md5 = (content) => {
  const md5 = createHash('md5');
  return md5.update(content).digest('hex');
};

// 加密函数
export const enPassword = (password, secret) => {
  const str = `password=${password}&secret=${secret}`;
  return md5(str);
};
