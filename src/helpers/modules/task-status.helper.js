export function getAvaiableStatusColors() {
  return ['light', 'dark', 'primary', 'success', 'warning', 'danger'];
}

export function getAvaiablePriorities() {
  return ['low', 'medium', 'high'];
}

export function parseStatusColor(color) {
  const colors = {
    light: 'white',
    dark: 'gray',
    primary: 'indigo',
    success: 'green',
    warning: 'warning',
    danger: 'red',
  };

  return colors[color];
}
