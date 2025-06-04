const { Octokit } = require('@octokit/rest');

// GitHub API 配置
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Avril0923';
const REPO_NAME = 'avril0923.github.io';

// 创建 Octokit 实例
const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

// 验证用户登录
async function verifyLogin(username, password) {
  return username === 'parent' && password === 'avril2019';
}

// 获取照片列表
async function getPhotos() {
  const { data } = await octokit.issues.listForRepo({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    labels: ['photo']
  });
  return data;
}

// 创建照片
async function createPhoto(photoData) {
  const { data } = await octokit.issues.create({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    title: `Photo: ${photoData.title}`,
    body: JSON.stringify(photoData),
    labels: ['photo']
  });
  return data;
}

// 更新照片
async function updatePhoto(issueNumber, photoData) {
  const { data } = await octokit.issues.update({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: issueNumber,
    title: `Photo: ${photoData.title}`,
    body: JSON.stringify(photoData)
  });
  return data;
}

// 删除照片
async function deletePhoto(issueNumber) {
  await octokit.issues.update({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: issueNumber,
    state: 'closed'
  });
}

// 获取日记列表
async function getDiaries() {
  const { data } = await octokit.issues.listForRepo({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    labels: ['diary']
  });
  return data;
}

// 创建日记
async function createDiary(diaryData) {
  const { data } = await octokit.issues.create({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    title: `Diary: ${diaryData.title}`,
    body: JSON.stringify(diaryData),
    labels: ['diary']
  });
  return data;
}

// 更新日记
async function updateDiary(issueNumber, diaryData) {
  const { data } = await octokit.issues.update({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: issueNumber,
    title: `Diary: ${diaryData.title}`,
    body: JSON.stringify(diaryData)
  });
  return data;
}

// 删除日记
async function deleteDiary(issueNumber) {
  await octokit.issues.update({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: issueNumber,
    state: 'closed'
  });
}

module.exports = {
  verifyLogin,
  getPhotos,
  createPhoto,
  updatePhoto,
  deletePhoto,
  getDiaries,
  createDiary,
  updateDiary,
  deleteDiary
}; 