export interface TokenPlayUriGames {
    category: string;
    descripttion: string;
    download: string;
    image: string;
    name: string;
    gameOwnerAddress?: string;
    gameRelease?: string;
    price: number;
    supply?: string;
    tokenId: number;
    tokenPlayRoyaltyPercentage?: string;
}

export interface categoryTokenPlayGames {
    name: string; //TODO enum con los valores
}