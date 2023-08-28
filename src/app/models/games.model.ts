export interface Game {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    added: number;
    platforms?: PlatformInfo[];
  }
  
  interface PlatformInfo {
    platform: Platform;
    released_at: string;
    requirements: Requirements;
  }
  
  interface Platform {
    id: number;
    slug: string;
    name: string;
  }
  
  interface Requirements {
    minimum: string;
    recommended: string;
  }
  