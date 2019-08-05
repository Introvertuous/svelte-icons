import cheerio from 'cheerio';
import glob from 'glob-promise';
import path from 'path';
import fs = require('fs');
import { promisify } from 'util';
import camelcase from 'camelcase';
import rimraf from 'rimraf';

const fsdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.resolve(rootDir, 'icons');
const DIST = path.resolve(rootDir, '.');

interface Content {
  files: string;
  formatter: (name: string) => string;
}

interface Icon {
  id: string;
  name: string;
  contents: Content[];
}

const icons: Icon[] = [
  {
    id: 'fa',
    name: 'Font Awesome',
    contents: [
      {
        files: path.resolve(iconsDir, 'fontawesome/svgs/+(brands|solid)/*.svg'),
        formatter: name => `Fa${name}`,
      },
      {
        files: path.resolve(iconsDir, 'fontawesome/svgs/regular/*.svg'),
        formatter: name => `FaReg${name}`,
      },
    ],
  },
  {
    id: 'io',
    name: 'Ionicons',
    contents: [
      {
        files: path.resolve(
          rootDir,
          'node_modules/ionicons/dist/collection/icon/svg/*.svg'
        ),
        formatter: name => `Io${name}`,
      },
    ],
  },
  {
    id: 'md',
    name: 'Material Design icons',
    contents: [
      {
        files: path.resolve(
          iconsDir,
          'material-design-icons/*/svg/production/*_24px.svg'
        ),
        formatter: name => name.replace(/Ic(\w+)24px/i, 'Md$1'),
      },
    ],
  },
  {
    id: 'ti',
    name: 'Typicons',
    contents: [
      {
        files: path.resolve(iconsDir, 'typicons/src/svg/*.svg'),
        formatter: name => `Ti${name}`,
      },
    ],
  },
  {
    id: 'go',
    name: 'Github Octicons icons',
    contents: [
      {
        files: path.resolve(rootDir, 'node_modules/octicons/build/svg/*.svg'),
        formatter: name => `Go${name}`,
      },
    ],
  },
  {
    id: 'fi',
    name: 'Feather',
    contents: [
      {
        files: path.resolve(
          rootDir,
          'node_modules/feather-icons/dist/icons/*.svg'
        ),
        formatter: name => `Fi${name}`,
      },
    ],
  },
  {
    id: 'gi',
    name: 'Game Icons',
    contents: [
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(carl-olsen|andymeneely|cathelineau|darkzaitzev|delapouite|faithtoken|generalace135|guard13007|heavenly-dog|irongamer|john-colburn|kier-heyl|lorc|lord-berandas|quoting|rihlsul|sbed|skoll|sparker|spencerdub|zajkonur)/originals/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(zeromancer|willdabeast|)/deviations/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(john-redman)/hands/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(lucasms)/equipment/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(priorblue)/batteries/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(viscious-speed)/abstract/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(various-artists)/public-domain/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(
          iconsDir,
          'game-icons-inverted/+(felbrigg)/arrows/svg/000000/transparent/*.svg'
        ),
        formatter: name => `Gi${name}`,
      },
      {
        files: path.resolve(iconsDir, 'game-icons-inverted/aussiesim/*.svg'),
        formatter: name => `Gi${name}`,
      },
    ],
  },
  {
    id: 'wi',
    name: 'Weather Icons',
    contents: [
      {
        files: path.resolve(iconsDir, 'weather-icons/svg/*.svg'),
        formatter: name => name,
      },
    ],
  },
  {
    id: 'di',
    name: 'Devicons',
    contents: [
      {
        files: path.resolve(iconsDir, 'devicons/!SVG/*.svg'),
        formatter: name => `Di${name}`,
      },
    ],
  },
];

const mkdir = (dir: string) => {
  const exists = fs.existsSync(dir);
  if (exists) {
    rimraf.sync(dir);
  }
  return fsdir(dir);
};

const write = (filePath: string[], content: string) =>
  writeFile(path.resolve(DIST, ...filePath), content, 'utf8');

const getIconFiles = async (content: Content) => glob(content.files);

interface Element {
  tag: string;
  attr: {
    viewBox: string;
    d: string;
  };
  child: Element[];
}

async function convertIconData(svg: string) {
  const $svg = cheerio.load(svg, { xmlMode: true })('svg');

  // filter/convert attributes
  // 1. remove class attr
  // 2. convert to camelcase ex: fill-opacity => fillOpacity
  const attrConverter = (attribs: { [key: string]: string }, tagName: string) =>
    attribs &&
    Object.keys(attribs)
      .filter(
        name =>
          ![
            'class',
            ...(tagName === 'svg'
              ? ['xmlns', 'xmlns:xlink', 'xml:space', 'width', 'height']
              : []), // if tagName is svg remove size attributes
          ].includes(name)
      )
      .reduce((obj, name) => {
        const newName = camelcase(name);
        switch (newName) {
          case 'fill':
            if (attribs[name] === 'none') {
              obj[newName] = attribs[name];
            }
            break;
          default:
            obj[newName] = attribs[name];
            break;
        }
        return obj;
      }, {});

  const elementToTree: any = (element: Cheerio) =>
    element
      .filter((_, e) => !!e.tagName && !['style'].includes(e.tagName))
      .map((_, e) => ({
        tag: e.tagName,
        attr: attrConverter(e.attribs, e.tagName),
        child:
          e.children && e.children.length
            ? elementToTree(cheerio(e.children))
            : undefined,
      }))
      .get();

  const tree = elementToTree($svg);
  return tree[0] as Element;
}

async function dirInit() {
  for (const icon of icons) {
    await mkdir(path.resolve(DIST, icon.id));
    await write([icon.id, 'index.js'], '// THIS FILE IS AUTO GENERATED\n');
    await write(
      [icon.id, 'package.json'],
      JSON.stringify(
        {
          sideEffects: false,
          module: './index.js',
        },
        null,
        2
      ) + '\n'
    );
    await mkdir(path.resolve(icon.id));
  }
}

async function writeIconModule(icon: Icon) {
  const appendFile = promisify(fs.appendFile);
  const filenames = new Set(); // for remove duplicate
  const filepaths = new Set();
  for (const content of icon.contents) {
    const files = await getIconFiles(content);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const svgStr = await promisify(fs.readFile)(file, 'utf8');
      const iconData = await convertIconData(svgStr);

      const rawName = path.basename(file, path.extname(file));

      const pascalName = camelcase(rawName, { pascalCase: true });
      const name =
        (content.formatter && content.formatter(pascalName)) || pascalName;
      if (filenames.has(name) || filepaths.has(name)) continue;
      filenames.add(name);

      // write like: module/fa/index.esm.js
      await appendFile(
        path.resolve(DIST, icon.id, 'index.js'),
        `export { default as ${name} } from './${name}.svelte';\n`,
        'utf8'
      );

      const { attr, child } = iconData;
      const { viewBox } = attr;

      const svgContent = child
        .map(({ attr }) => {
          const { d } = attr;
          return `<path d="${d}" />`;
        })
        .join('\n');

      await write(
        [icon.id, `${name}.svelte`],
        `<script>
        import IconBase from '../components/IconBase.svelte';
        </script>
        <IconBase viewBox="${viewBox}" {...$$props}>
          ${svgContent}
        </IconBase>
      `
      );

      filepaths.add(file);
    }
  }
}

async function main() {
  try {
    await dirInit();
    for (const icon of icons) {
      await writeIconModule(icon);
    }
    console.log('build completed successfully');
  } catch (e) {
    console.error(e);
  }
}

main();
