import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked, onChange, className = '' }: SwitchProps) {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      className={`${checked ? 'bg-indigo-500' : 'bg-gray-200'}
        relative inline-flex h-5 w-9 items-center rounded-full
        transition-colors duration-200 ease-in-out focus:outline-none
        focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75
        ${className}`}>
      <span className="sr-only">启用动画</span>
      <span
        className={`${checked ? 'translate-x-4' : 'translate-x-0'}
          pointer-events-none inline-block h-4 w-4 transform rounded-full
          bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </HeadlessSwitch>
  );
}
