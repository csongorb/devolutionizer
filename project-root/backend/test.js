const simpleGit = require('simple-git');
const git = simpleGit('C:/Users/admin/repotest/itisasifyouweremakinglove');

git.log({ maxCount: 1 })
  .then(log => console.log('✅ LOG:', log))
  .catch(err => console.error('❌ Error:', err));
