const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();
const config = {
  dirs: {
    source: path.resolve(baseDir, 'src/renderer/locale/lang'),
    checked: path.resolve(baseDir, 'src/renderer/locale/checked'),
    patch: path.resolve(baseDir, 'src/renderer/locale/patch'),
    checking: path.resolve(baseDir, 'src/renderer/locale/checking'),
  },
};

genPatchFiles();
genCheckingFiles();

function genCheckingFiles() {
  if (!fs.existsSync(config.dirs.checking)) {
    fs.mkdirSync(config.dirs.checking);
  }
  const langsChecked = readFromChecked(config.dirs.checked);
  const langsSource = readFromSource(config.dirs.source);
  const cnChecking = {};

  for (const lang in langsSource) {
    if (lang in langsChecked) {
      const checked = langsChecked[lang];
      const source = langsSource[lang];
      const checking = {};
      for (const key in source) {
        if (!(key in checked)) {
          checking[key] = source[key];
          cnChecking[key] = langsSource['zh-cn'][key];
        }
      }
      if (Object.keys(checking).length) {
        fs.writeFileSync(
          path.join(config.dirs.checking, lang + '.json'),
          JSON.stringify(checking, null, 2),
          'utf8'
        );
      }
    }
  }

  fs.writeFileSync(
    path.join(config.dirs.checking, 'zh-cn.ref.json'),
    JSON.stringify(cnChecking, null, 2),
    'utf8'
  );
}

function genPatchFiles() {
  if (!fs.existsSync(config.dirs.patch)) {
    fs.mkdirSync(config.dirs.patch);
  }
  const langsChecked = readFromChecked(config.dirs.checked);
  const langsSource = readFromSource(config.dirs.source);

  for (const lang in langsChecked) {
    if (lang == 'zh-cn') continue;
    if (lang in langsSource) {
      const checked = langsChecked[lang];
      const source = langsSource[lang];
      const patch = {};
      for (const key in checked) {
        if (key in source && checked[key] != source[key]) {
          patch[key] = checked[key];
        }
      }
      if (Object.keys(patch).length) {
        fs.writeFileSync(
          path.resolve(config.dirs.patch, lang + '.json'),
          JSON.stringify(patch, null, 2),
          'utf8'
        );
      }
    }
  }
}

function readFromSource(dir) {
  const langs = {};
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const filename of files) {
      const trans = fs.readFileSync(path.join(dir, filename), 'utf8');
      const [lang] = filename.split('.');
      langs[lang] = JSON.parse(trans);
    }
  }
  return langs;
}

function readFromChecked(dir) {
  const langs = {};

  function mergeLangTrans(langDataList) {
    const translation = {};
    for (const { trans } of langDataList.sort((a, b) => a.id - b.id)) {
      Object.assign(translation, trans);
    }
    return translation;
  }

  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const filename of files) {
      const [lang, id] = filename.split('.');
      const trans = fs.readFileSync(path.join(dir, filename), 'utf8');
      if (langs[lang] == null) {
        langs[lang] = [];
      }
      // group by lang
      langs[lang].push({ lang, id: Number(id), trans: JSON.parse(trans) });
    }
    for (const lang in langs) {
      langs[lang] = mergeLangTrans(langs[lang]);
    }
  }
  return langs;
}
