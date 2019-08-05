import { writable } from 'svelte/store';

export const filter = writable('');
export const category = writable('');
export const color = writable('#000000');
export const icons = writable([]);
export const loading = writable(false);
export const scrolling = writable(false);

const PAGE_SIZE = 120;
let frame = PAGE_SIZE;
let collection = [];
let filterBy = '';

export const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    scrolling.set(false);
  }
};

export const load = async category => {
  let result = {};
  /**
   * The reason we cannot use variables inside the import is because code splitting (chunking)
   * only works when the bundler gets a string literal.
   *
   * TODO: Note that HMR is unusably slow when any more that one of these are not commented out,
   * but there must be a better way to do this.
   */

  const loadingTimeout = setTimeout(() => loading.set(true), 100);

  if (category === 'di') {
    result = await import('svelte-icons/di');
  } else if (category === 'fa') {
    result = await import('svelte-icons/fa');
  } else if (category === 'fi') {
    result = await import('svelte-icons/fi');
  } else if (category === 'gi') {
    result = await import('svelte-icons/gi');
  } else if (category === 'go') {
    result = await import('svelte-icons/go');
  } else if (category === 'io') {
    result = await import('svelte-icons/io');
  } else if (category === 'md') {
    result = await import('svelte-icons/md');
  } else if (category === 'ti') {
    result = await import('svelte-icons/ti');
  } else if (category === 'wi') {
    result = await import('svelte-icons/wi');
  }

  scrollToTop();

  collection = Object.entries(result).map(([id, component]) => [
    id,
    component,
    `import ${id} from 'svelte-icons/${category}/${id}.svelte'`,
  ]);

  frame = PAGE_SIZE;
  sliceIcons(0, frame, true);

  clearTimeout(loadingTimeout);
  loading.set(false);
};

const sliceIcons = (from, to, reset = false) => {
  const filtered = collection.filter(([name]) =>
    name.toLowerCase().includes(filterBy)
  );

  if (to >= collection.length) {
    return icons.set(filtered);
  }

  const iconChunk = filtered.slice(from, to);

  if (reset) {
    return icons.set(iconChunk);
  }

  return icons.update(prev => [...prev, ...iconChunk]);
};

if (typeof window !== 'undefined') {
  window.onscroll = function(ev) {
    const { innerHeight, pageYOffset } = window;
    scrolling.set(pageYOffset > 0);

    const scrollEl = document.getElementsByTagName('main')[0];

    if (innerHeight + pageYOffset >= scrollEl.offsetHeight - 2) {
      const nextFrame = frame + PAGE_SIZE;
      sliceIcons(frame, nextFrame);
      frame = nextFrame;
    }
  };
}

category.subscribe(load);

filter.subscribe(value => {
  filterBy = value.toLowerCase();
  sliceIcons(0, PAGE_SIZE, true);
  scrollToTop();
});
