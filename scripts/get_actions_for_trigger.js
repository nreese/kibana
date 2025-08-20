const { exec, spawn } = require('child_process');

console.log('Gathering actions for trigger');

/*
exec('grep -r "CONTEXT_MENU_TRIGGER" ./src', (err, stdout) => {
  if (err) return console.log(err)
  //console.log(stdout)
})*/

const grep = spawn('grep', ['-r', 'CONTEXT_MENU_TRIGGER', './src']);
grep.stdout.on('data', function (data) {
  const matches = data.toString().split('\n');
  matches.forEach(match => {
    const split = match.indexOf(':');
    const fileName = match.substring(0, split);
    if (!fileName.startsWith('./') || fileName.includes('/target/') || fileName.includes('.test.')) {
      return;
    }
    const pattern = match.substring(split);
    console.log('fileName', fileName);
    console.log('pattern', pattern);
  });
  console.log('matches.length', matches.length);
  //console.log('stdout: ' + data.toString());
});


grep.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

grep.on('exit', function (code) {
  
});