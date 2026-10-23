export interface OverlayFrame {
  visible: boolean;
  text: string;
  height: number;
  rect: DOMRect | null;
}

// Shadow DOM isolates the band from YouTube's CSS. The host is position: fixed,
// but an ancestor with a filter (grayscale) turns it into the containing block,
// so the measured offset is corrected after every placement.
export function createTimerOverlay() {
  const host = document.createElement('div');
  host.id = 'yhm-timer';
  host.style.display = 'none';

  const shadow = host.attachShadow({ mode: 'closed' });
  shadow.innerHTML = `
    <style>
      :host {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483647;
        pointer-events: none;
      }
      .band {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.35);
        color: #fff;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        user-select: none;
      }
    </style>
    <div class="band"></div>
  `;
  const band = shadow.querySelector<HTMLDivElement>('.band')!;

  return {
    mount(parent: Element) {
      if (host.parentElement !== parent) parent.appendChild(host);
    },
    update({ visible, text, height, rect }: OverlayFrame) {
      const show = visible && rect !== null;
      host.style.display = show ? 'block' : 'none';
      if (!show) return;

      band.textContent = text;
      band.style.fontSize = `${Math.round(height * 0.7)}px`;
      host.style.width = `${rect.width}px`;
      host.style.height = `${height}px`;

      host.style.left = `${rect.left}px`;
      host.style.top = `${rect.top}px`;
      const actual = host.getBoundingClientRect();
      host.style.left = `${rect.left - (actual.left - rect.left)}px`;
      host.style.top = `${rect.top - (actual.top - rect.top)}px`;
    },
  };
}
