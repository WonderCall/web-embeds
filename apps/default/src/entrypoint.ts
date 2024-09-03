import WonderCallComponent from './Modal.svelte';

interface WonderCallSettings {
    primaryColor?: string;
    secondaryColor?: string;
    modalTitle?: string;
    modalContent?: string;
    launchCallButtonText?: string;
    endCallButtonText?: string;
}

let instance: WonderCallComponent | null = null;

function mount(config: WonderCallSettings = {}): WonderCallComponent | void {
    if (instance) {
        console.warn('WonderCall is already mounted. Call WonderCall.unmount() first.');
        return;
    }

    const target = document.createElement('div');
    document.body.appendChild(target);

    instance = new WonderCallComponent({
        target: target,
        props: { passedSettings: config }
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
