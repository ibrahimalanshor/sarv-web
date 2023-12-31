import { ref } from 'vue';
import { useError } from './error.compose';
import { useValidation } from './validation.compose';
import { useToastStore } from 'src/store/modules/toast.module';
import { http } from 'src/helpers/http';

export function useRequest({
  method,
  url: initUrl,
  notifyOnError,
  initLoading,
  initData,
  formData,
}) {
  const { error, setError, resetError } = useError();
  const { validation, setValidation, resetValidation } = useValidation();
  const toastStore = useToastStore();

  const loading = ref(initLoading ?? false);
  const data = ref(initData ?? null);
  const url = ref(initUrl);

  function parseParams(params) {
    if (!formData) {
      return params;
    }

    return Object.keys(params).reduce((formData, key) => {
      formData.append(key, params[key]);

      return formData;
    }, new FormData());
  }
  async function request(params) {
    loading.value = true;
    resetError();
    resetValidation();

    try {
      const res = await http[method](url.value, parseParams(params));

      data.value = res.data;

      return [res.data, null];
    } catch (err) {
      if (err.response?.status === 422) {
        setValidation(err.response.data.errors);
      } else {
        setError(err);
      }

      if (notifyOnError) {
        toastStore.createToast({
          title: error.value,
          type: 'error',
          message: error.value,
        });
      }

      return [false, error.value];
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    url,
    error,
    validation,
    loading,
    request,
    setError,
    resetError,
    resetValidation,
  };
}
