<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  interface WonderCallSettings {
    primaryColor?: string;
    secondaryColor?: string;
    buttonText?: string;
    modalTitle?: string;
    modalContent?: string;
  }

  let settings: WonderCallSettings = {
    primaryColor: '#3B82F6',
    secondaryColor: '#EF4444',
    buttonText: 'Open Modal',
    modalTitle: 'Modal Content',
    modalContent: 'This is the content of your modal.',
  };

  let isOpen = false;
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
      @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
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
</script>

<svelte:options tag="wonder-call" />

{#if shadowRoot}
  <div class="fixed bottom-4 right-4 z-50">
    {#if !isOpen}
      <button
              on:click={toggleModal}
              class="wondercall-btn-primary absolute bottom-0 right-0 w-48 text-white font-bold py-2 px-4 rounded"
      >
        {settings.buttonText}
      </button>
    {/if}

    {#if isOpen}
      <div
              transition:fly={{ y: 10, duration: 300, easing: cubicOut }}
              class="bg-white rounded-lg shadow-xl p-6 w-80"
      >
        <h2 class="text-xl font-bold mb-4">{settings.modalTitle}</h2>
        <p class="mb-4">{settings.modalContent}</p>
        <button
                on:click={toggleModal}
                class="wondercall-btn-secondary text-white font-bold py-2 px-4 rounded"
        >
          Close Modal
        </button>
      </div>
    {/if}
  </div>
{/if}