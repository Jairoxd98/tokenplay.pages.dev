export interface TokenPlayUriGames {
    category: string;
    description: string;
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

export interface MarketPlaceTokenPlayUriGames {
    arrayPosition:number;
    category: string;
    description: string;
    download: string;
    image: string;
    name: string;
    price: number;
    saleId: number;
    seller: string;
    status: number;
    tokenId: number;
}