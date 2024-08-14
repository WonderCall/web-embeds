<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { Phone, PhoneOff, X } from 'lucide-svelte';

  interface WonderCallSettings {
    primaryColor?: string;
    secondaryColor?: string;
    modalTitle?: string;
    modalContent?: string;
    launchCallButtonText?: string;
    endCallButtonText?: string;
  }

  let settings: WonderCallSettings = {
    primaryColor: '#3B82F6',
    secondaryColor: '#EF4444',
    modalTitle: 'Talk to WonderCall',
    modalContent: 'WonderCall is an AI Assistant you can talk to, just like a human!',
    launchCallButtonText: 'Start Call',
    endCallButtonText: 'End Call',
  };

  let isOpen = false;
  let isCallActive = false;
  let callTime = 0;
  let shadowRoot: ShadowRoot;
  let host: HTMLElement;

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

    return () => {
      document.body.removeChild(host);
    };
  });

  function toggleModal() {
    isOpen = !isOpen;
  }
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function startCall() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    isCallActive = true;
    callTime = 0;

    intervalId = setInterval(() => {
      callTime += 1;
    }, 1000);
  }

  function endCall() {
    isCallActive = false;
    callTime = 0;
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

<svelte:options tag="wonder-call" />

{#if shadowRoot}
  <div class="fixed bottom-4 right-4 z-50">
    {#if !isOpen}
      <button
              on:click={toggleModal}
              class="hover-border-indigo wondercall-btn-primary absolute bottom-0 right-0 w-20 hover:shadow-2xl hover:shadow-indigo-600/20 text-white p-0 rounded-full font-bold object-cover"
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
              class="bg-white min-h-80 flex flex-col justify-between text-black dark:bg-neutral-950 dark:text-white rounded-lg shadow-xl p-6 w-80"
      >
        <button on:click={toggleModal} class="absolute top-6 right-6  text-neutral-500 hover:text-neutral-700">
          <X size={24} />
        </button>
        <div class="flex flex-col mb-4">
          <h2 class="text-xl font-bold mb-4">{settings.modalTitle}</h2>
          <p class="mb-4">{settings.modalContent}</p>
        </div>
        {#if isCallActive}
          <div class="text-center font-mono text-2xl mb-4">
            {formatTime(callTime)}
          </div>
        {/if}
        <div class="flex justify-center w-full">
          {#if !isCallActive}
            <button
                    on:click={startCall}
                    class="wondercall-btn-primary hover-border-indigo w-full dark:bg-neutral-800 bg-neutral-200 dark:text-white flex items-center justify-center text-white font-bold py-2 px-4 rounded"
            >
              <Phone class="mr-2" size={20} />
              {settings.launchCallButtonText}
            </button>
          {:else}
            <button
                    on:click={endCall}
                    class="w-full wondercall-btn-secondary flex items-center text-black bg-rose-400 dark:bg-rose-700 justify-center dark:text-white font-bold py-2 px-4 rounded"
            >
              <PhoneOff class="mr-2" size={20} />
              {settings.endCallButtonText}
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}