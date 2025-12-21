let _ensurePromise = null;

export function ensureJsQr({
    scriptSrc = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js",
    globalName = "jsQR",
    id = "jsqr-script",
    timeoutMs = 15000,
} = {}) {
    const existing = globalThis?.[globalName];
    if (typeof existing === 'function') return Promise.resolve(existing);

    if (_ensurePromise) return _ensurePromise;

    _ensurePromise = new Promise((resolve, reject) => {
        const already = document.getElementById(id);
        if (already) {
            const done = () => {
                const fn = globalThis?.[globalName];
                if (typeof fn === 'function') resolve(fn);
                else reject(new Error(`${globalName} not found after script load`));
            };
            if (already.getAttribute('data-loaded') === 'true') {
                done();
                return;
            }
            already.addEventListener('load', () => {
                already.setAttribute('data-loaded', 'true');
                done();
            }, { once: true });
            already.addEventListener('error', () => reject(new Error(`Failed to load ${scriptSrc}`)), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.id = id;
        script.src = scriptSrc;
        script.async = true;

        let t = null;
        if (timeoutMs > 0) {
            t = setTimeout(() => {
                reject(new Error(`Timeout loading ${scriptSrc}`));
            }, timeoutMs);
        }

        script.addEventListener('load', () => {
            try { if (t) clearTimeout(t); } catch {}
            script.setAttribute('data-loaded', 'true');
            const fn = globalThis?.[globalName];
            if (typeof fn === 'function') resolve(fn);
            else reject(new Error(`${globalName} not found after script load`));
        }, { once: true });

        script.addEventListener('error', () => {
            try { if (t) clearTimeout(t); } catch {}
            reject(new Error(`Failed to load ${scriptSrc}`));
        }, { once: true });

        document.head.appendChild(script);
    }).finally(() => {
        const fn = globalThis?.[globalName];
        if (typeof fn === 'function') return;
        _ensurePromise = null;
    });

    return _ensurePromise;
}

export async function detectQr(input, opts = {}) {
    const jsQR = await ensureJsQr(opts.ensure ?? undefined);

    const img = input?.imageData ?? input;
    const data = img?.data ?? input?.data;
    const width = img?.width ?? input?.width;
    const height = img?.height ?? input?.height;

    if (!data || !width || !height) {
        throw new Error('detectQr expects ImageData or { data, width, height }');
    }

    return jsQR(data, width, height, opts.jsqr ?? undefined) || null;
}
