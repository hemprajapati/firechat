import { ref, computed, watch } from 'vue';
export function useClipboard() {
    const copied = ref(false);
    const error = ref(null);
  
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        copied.value = true;
        error.value = null;
        setTimeout(() => (copied.value = false), 2000); 
      } catch (err) {
        error.value = 'Failed to copy';
      }
    };
  
    return {
      copied,
      error,
      copyToClipboard,
    };
  }