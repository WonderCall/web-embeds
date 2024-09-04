import WonderCallComponent from './Modal.svelte';
import styles from './assets/main.css?inline';

export interface WonderCallSettings {
    textColor?: string;
    backgroundColor?: string;
    accentColor?: string;
    modalTitle?: string;
    modalContent?: string;
    launchCallButtonText?: string;
    endCallButtonText?: string;
    assistantId?: string;
    apiPublicKey: string;
}

let instance: WonderCallComponent | null = null;
let shadowRoot: ShadowRoot | null = null;

function mount(config: WonderCallSettings): WonderCallComponent | void {
    if (instance) {
        console.warn('WonderCall is already mounted. Call WonderCall.unmount() first.');
        return;
    }

    const container = document.createElement('div');

    shadowRoot = container.attachShadow({ mode: 'open' });

    const target = document.createElement('div');
    shadowRoot.appendChild(target);

    const style = document.createElement('style');
    style.textContent = styles;
    shadowRoot.appendChild(style);

    document.body.appendChild(container);

    instance = new WonderCallComponent({
        target: target,
        props: { customSettings: config }
    });

    return instance;
}


function unmount(): void {
    if (instance) {
        instance.$destroy();
        instance = null;
    }
}

interface WonderCallGlobal {
    mount: typeof mount;
    unmount: typeof unmount;
}

declare global {
    interface Window {
        WonderCall: WonderCallGlobal;
    }
}

window.WonderCall = {
    mount,
    unmount
};
