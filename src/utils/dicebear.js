/**
 * Get DiceBear Pixel Art Avatar URL
 * @param {string} seed - The seed for the avatar
 * @returns {string} - The URL of the avatar image
 */
export const getAvatar = (seed) => {
    // Using DiceBear v9 API
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
};

/**
 * Get a random seed for the Quest Giver
 */
export const getRandomSeed = () => {
    const seeds = ['Hero', 'Mage', 'Rogue', 'Paladin', 'Bard', 'Merchant', 'Cat', 'Dog', 'Dragon'];
    return seeds[Math.floor(Math.random() * seeds.length)];
};
