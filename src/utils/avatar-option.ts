import { SETTINGS } from './constant'
import { getRandomValue } from './random'

export interface AvatarOption {
  body: {
    shape: string
  }
  face: {
    shape: string
  }
  head: {
    shape: string
  }
}
export function getRandomAvatarOption(): AvatarOption {
  const avatarOption = {
    accessories: {
      shape: "None",
    },
    body: {
      shape: getRandomValue(SETTINGS.body),
    },
    face: {
      shape: getRandomValue(SETTINGS.face),
    },
    facialHair: {
      shape: getRandomValue(SETTINGS.facialHair),
    },
    head: {
      shape: getRandomValue(SETTINGS.head),
    },
    // eyes: {
    //   shape: getRandomValue(SETTINGS.eyes),
    // },
    // mouth: {
    //   shape: getRandomValue(SETTINGS.mouth),
    // },
    // nose: {
    //   shape: getRandomValue(SETTINGS.nose),
    // },
    // eyebrows: {
    //   shape: getRandomValue(SETTINGS.eyebrows),
    // },
  }

  return avatarOption
}

export async function loadSvg(type: string, name: string): Promise<string> {
  if (name.toLowerCase() === 'none') {
    return `
    <svg 
      width=60 
      height=60 
      viewBox="0 0 60 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M45 15L15 45M15 15L45 45" 
        stroke="currentColor" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
    </svg>`
  }

  try {
    return (await import(`../assets/widgets/${type}/${name}.svg?raw`)).default;
  } catch (error) {
    console.warn(`Failed to load widget: ${type}/${name}`);
    return ''
  }
}
