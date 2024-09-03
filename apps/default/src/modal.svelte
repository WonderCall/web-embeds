<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, crossfade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { Phone, PhoneOff, X, Minimize2 } from 'lucide-svelte';
  import WonderCall from "../../../packages/web-sdk/wondercall";
  import Spinner from "./lib/Spinner.svelte";

  interface WonderCallSettings {
    primaryColor?: string;
    secondaryColor?: string;
    modalTitle?: string;
    modalContent?: string;
    launchCallButtonText?: string;
    endCallButtonText?: string;
  }

  export let customSettings: WonderCallSettings;

  $: settings = {
    primaryColor: '#3B82F6',
    secondaryColor: '#EF4444',
    modalTitle: 'Talk to WonderCall',
    modalContent: 'WonderCall is an AI Assistant you can talk to, just like a human!',
    launchCallButtonText: 'Start Call',
    endCallButtonText: 'End Call',
    ...customSettings
  };


  let isOpen = false;
  let callStatus: 'inactive' | 'loading' | 'active' = 'inactive';
  let callTime = 0;
  let shadowRoot: ShadowRoot;
  let host: HTMLElement;
  let wonderCall: WonderCall;
  let wonderVolume: number = 0;

  const [statusOut, statusIn] = crossfade({
    duration: 400,
    easing: cubicOut
  });

  onMount(() => {
    const customSettings = (window as any).wondercall || {};
    settings = { ...settings, ...customSettings };

    host = document.createElement('div');
    document.body.appendChild(host);
    shadowRoot = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      .wondercall-btn-primary { background-color: ${settings.primaryColor}; }
      .wondercall-btn-secondary { background-color: ${settings.secondaryColor}; }
    `;
    shadowRoot.appendChild(style);

    wonderCall = new WonderCall(import.meta.env.VITE_WONDERCALL_API_KEY);

    wonderCall.on("call-start", () => {
      callStatus = 'active';
    });

    wonderCall.on("volume-level", (volume) => {
      wonderVolume = volume;
    });

    wonderCall.on("call-end", () => {
      wonderVolume = 0;
      callStatus = 'inactive';
      callTime = 0;
    });

    return () => {
      document.body.removeChild(host);
      wonderCall.removeAllListeners();
    };
  });

  function toggleModal() {
    isOpen = !isOpen;
  }

  let intervalId: ReturnType<typeof setInterval> | null = null;

  async function startCall() {
    callStatus = 'loading';
    await wonderCall.start("9b7dd079-9160-4805-9cbd-387df9dc3005");
    callTime = 0;
    intervalId = setInterval(() => {
      callTime += 1;
    }, 1000);
  }

  function endCall() {
    callStatus = 'loading';
    wonderCall.stop();
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<style>

  .grid-stack {
    display: grid;
    grid-template: 1fr / 1fr;
  }

  .grid-stack > * {
    grid-area: 1 / 1;
  }


  .wonder-volume-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(90deg, #4f46e5, #818cf8);
    opacity: min(calc(var(--wonder-volume) + var(--min-volume-border-opacity)), var(--max-volume-border-opacity));
    box-shadow: 0 0 20px 20px  rgba(99, 102, 241, min(calc(var(--wonder-volume) * 0.7), var(--max-volume-glow-opacity)));
    z-index: -1;
    transition: opacity 0.1s ease-in-out;
  }

</style>


<svelte:options tag="wonder-call" />

{#if shadowRoot}
  <div class="fixed bottom-4 right-4 z-50 overflow-visible" style="--wonder-volume: {wonderVolume}; --max-volume-glow-opacity: {0.075}; --max-volume-border-opacity: {0.5}; --min-volume-border-opacity: {0}">
    {#if !isOpen}
      <button
              on:click={toggleModal}
              class="wonder-volume-border before:rounded-full wondercall-btn-primary absolute bottom-0 right-0 w-20 hover:shadow-2xl hover:shadow-indigo-600/20 hover:ring-indigo-600 hover:ring-1 text-white p-0 rounded-full font-bold object-cover"
      >
        <img
                src="https://assets.wondercall.ai/img/mascot-wondercall-full.jpg"
                alt="WonderCall mascot"
                class="rounded-full w-[99%] h-[99%]"
        />
      </button>
    {/if}

    {#if isOpen}
      <div
              transition:fly={{ y: 10, duration: 300, easing: cubicOut }}
              class="wonder-volume-border before:rounded-lg before:-z-10 bg-white min-h-80 flex flex-col justify-between text-black dark:bg-neutral-950 dark:text-white rounded-lg shadow-xl p-6 w-80"
      >
        <button
                style="--max-volume-glow-opacity: {0.2}; --max-volume-border-opacity: {1}; --min-volume-border-opacity: {0.3}"
                on:click={toggleModal} class="absolute top-6 right-6 text-neutral-500 hover:text-neutral-700">


          <div class="grid-stack">
          {#if callStatus === 'inactive'}
            <div transition:scale={{ duration: 300, start: 0.5 }}>
            <X  size={24} />
            </div>
          {:else}
            <div transition:scale={{ duration: 300, delay: 150, start: 0.5 }}>
            <Minimize2 size={24} />
            </div>

          {/if}
          </div>
        </button>
        <div class="flex flex-col">
          <h2 class="text-xl font-bold mb-4">{settings.modalTitle}</h2>
          <p class="">{settings.modalContent}</p>
        </div>
        <div class="flex flex-col items-center justify-center h-20 relative">
        {#if callStatus === 'active'}
          <div transition:fly={{ y: 10, duration: 300, easing: cubicOut }} class="absolute top-1/2 transform -translate-y-1/2 text-center font-mono text-2xl">
            {formatTime(callTime)}
          </div>
        {:else if callStatus === 'loading'}
          <div transition:fly={{ y: 10, duration: 300, easing: cubicOut }} class="absolute top-1/2 transform -translate-y-1/2">
            <Spinner size={80} color="#4F46E5" />
          </div>
        {/if}
          </div>
        <div class="flex justify-center w-full">
          {#if callStatus === 'inactive'}
            <button
                    on:click={startCall}
                    class="wondercall-btn-primary hover-border-indigo w-full dark:bg-neutral-800 bg-neutral-200 dark:text-white flex items-center justify-center text-white font-bold py-2 px-4 rounded"
            >
              <Phone class="mr-2" size={20} />
              {settings.launchCallButtonText}
            </button>
          {:else if callStatus === 'active'}
            <button
                    on:click={endCall}
                    class="w-full wondercall-btn-secondary flex items-center text-black bg-rose-400 dark:bg-rose-700 justify-center dark:text-white font-bold py-2 px-4 rounded"
            >
              <PhoneOff class="mr-2" size={20} />
              {settings.endCallButtonText}
            </button>
          {:else}
            <button
                    class="w-full bg-neutral-400 dark:bg-neutral-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
                    disabled
            >
              Connecting...
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}