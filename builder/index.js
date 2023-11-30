import Fontagon from 'fontagon'

Fontagon({
  files: [
    'assets/icons/*.svg',
  ],
  dist: 'dist/',
  fontName: 'homekit-icons',
  style: 'all',
  classOptions: {
    baseClass: 'homekit-icons',
    classPrefix: 'hk',
  },
}).then((opts) => {
  console.log('done! ', opts)
}).catch((err) => {
  console.log('fail! ', err)
})
