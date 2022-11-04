const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const config = {
  outDir: path.join(__dirname, '../../src/renderer/locale'),
  langs: [
    {
      lang: 'zh-cn',
      select: (d) => d.description,
    },
    {
      lang: 'en',
      select: (d) => d.defaultMessage,
    },
  ],
};

const isProd = process.env.NODE_ENV === 'production';

function md5(txt) {
  return crypto.createHash('md5').update(txt).digest('hex');
}

exports.format = function (messages) {
  const langDir = path.join(config.outDir, 'lang');
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  messages = sortMap(messages);

  for (const item of config.langs) {
    const msgs = selectValues(messages, item.select);
    // merge
    const content = JSON.stringify(msgs, null, 2);
    const fileName = md5(content).slice(0, 6);

    fs.writeFileSync(
      path.join(config.outDir, 'lang', item.lang + '.json'),
      content,
      'utf-8'
    );
  }
  return '';
};

function sortMap(obj) {
  return Object.entries(obj)
    .sort((a, b) => (a[1].key < b[1].key ? -1 : 1))
    .reduce((state, [key, value]) => {
      state[key] = value;
      return state;
    }, {});
}

function selectValues(obj, select) {
  const out = {};
  for (const key in obj) {
    out[key] = select(obj[key], key);
  }
  return out;
}
