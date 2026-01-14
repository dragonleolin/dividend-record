import { ref } from 'vue';

export const useSound = () => {
    const playClick = () => {
        // Placeholder audio logic
        // const audio = new Audio('/sounds/click.mp3');
        // audio.play().catch(e => console.log('Audio play failed:', e));
        console.log('UseSound: *BLIP*');
    };

    const playLevelUp = () => {
        // Placeholder audio logic
        // const audio = new Audio('/sounds/levelup.mp3');
        // audio.play().catch(e => console.log('Audio play failed:', e));
        console.log('UseSound: *LEVEL UP JINGLE*');
    };

    return {
        playClick,
        playLevelUp
    };
};
