<script>
  let count = 0;
  let toasts = [];
  let themes = {
    danger: '#bb2124',
    success: '#22bb33',
    warning: '#f0ad4e',
    info: '#5bc0de',
    default: '#aaaaaa',
  };

  const animateOut = (node, { delay = 0, duration = 300 }) => ({
    delay,
    duration,
    css: t =>
      `opacity: ${(t - 0.5) *
        1}; transform-origin: top right; transform: scaleX(${(t - 0.5) * 1});`,
  });

  export function removeToast(id) {
    toasts = toasts.filter(t => t.id != id);
  }

  export function show(msg, sub, theme = 'default', timeout = 3500) {
    const background = themes[theme] || themes['default'];
    toasts = [
      {
        id: count,
        msg,
        sub,
        background,
        timeout,
      },
      ...toasts,
    ];
    count = count + 1;
  }
</script>

<style>
  .toasts {
    list-style: none;
    position: fixed;
    top: 58px;
    right: 0;
    padding: 0;
    margin: 0;
  }

  .toast {
    position: relative;
    margin: 10px;
    position: relative;
    animation: animate-in 350ms forwards;
    color: #fff;
  }

  .content {
    padding: 10px;
    font-weight: 500;
    text-decoration: underline;
  }

  .sub {
    padding: 0 10px 10px 10px;
    font-weight: 700;
    color: rgb(211, 0, 255);
  }

  .progress {
    position: absolute;
    bottom: 0;
    background-color: rgb(0, 0, 0, 0.3);
    height: 6px;
    width: 100%;
    animation-name: shrink;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .toast:before,
  .toast:after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 50%;
    bottom: 0;
    left: 10px;
    right: 10px;
    border-radius: 100px / 10px;
  }

  .toast:after {
    right: 10px;
    left: auto;
    transform: skew(8deg) rotate(3deg);
  }

  @keyframes animate-in {
    0% {
      width: 0;
      opacity: 0;
      transform: scale(1.15) translateY(20px);
    }
    100% {
      width: 100%;
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes shrink {
    0% {
      width: 100%;
    }
    100% {
      width: 0;
    }
  }
</style>

<ul class="toasts">
  {#each toasts as toast (toast.id)}
    <li class="toast" style="background: {toast.background};" out:animateOut>
      <div class="content">{toast.msg}</div>
      <div class="sub">{toast.sub}</div>
      <div
        class="progress"
        style="animation-duration: {toast.timeout}ms;"
        on:animationend={() => removeToast(toast.id)} />
    </li>
  {/each}
</ul>
