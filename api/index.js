const github = require('./github');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action, data } = req.body;

    switch (action) {
      case 'login':
        const { username, password } = data;
        const isValid = await github.verifyLogin(username, password);
        if (isValid) {
          res.json({ success: true });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
        break;

      case 'getPhotos':
        const photos = await github.getPhotos();
        res.json(photos);
        break;

      case 'createPhoto':
        const newPhoto = await github.createPhoto(data);
        res.json(newPhoto);
        break;

      case 'updatePhoto':
        const updatedPhoto = await github.updatePhoto(data.issueNumber, data.photoData);
        res.json(updatedPhoto);
        break;

      case 'deletePhoto':
        await github.deletePhoto(data.issueNumber);
        res.json({ success: true });
        break;

      case 'getDiaries':
        const diaries = await github.getDiaries();
        res.json(diaries);
        break;

      case 'createDiary':
        const newDiary = await github.createDiary(data);
        res.json(newDiary);
        break;

      case 'updateDiary':
        const updatedDiary = await github.updateDiary(data.issueNumber, data.diaryData);
        res.json(updatedDiary);
        break;

      case 'deleteDiary':
        await github.deleteDiary(data.issueNumber);
        res.json({ success: true });
        break;

      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 