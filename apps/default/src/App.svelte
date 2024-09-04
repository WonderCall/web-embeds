<script lang="ts">
  import Modal from './Modal.svelte';
  import "./assets/main.css";
</script>

<main class="w-full min-h-screen bg-neutral-800 flex flex-col items-center justify-center">
  <h1 class="text-3xl text-white font-bold mb-4">Sample Website Content</h1>
  <Modal customSettings={ { apiPublicKey: import.meta.env.VITE_WONDERCALL_API_KEY } } />
</main>