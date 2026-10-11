// Internationalization strings for Balloon Pop Game
// Default language: Vietnamese (vi)

const STRINGS = {
    vi: {
        // Start screen
        title: 'Bắn Bóng Bay!',
        play: 'CHƠI',
        soundOn: '🔊 Bật Âm Thanh',
        soundOff: '🔇 Tắt Âm Thanh',

        // Game HUD
        score: 'Điểm:',
        lives: 'Mạng:',
        time: 'Thời gian:',

        // Game over screen
        gameOver: 'Kết Thúc!',
        finalScore: 'Điểm Cuối:',
        newHighScore: '🎉 Kỷ Lục Mới! 🎉',
        enterInitials: 'Nhập tên viết tắt:',
        initialsPlaceholder: 'ABC',
        submit: 'Gửi',
        topScores: 'Top 5 Điểm Cao',
        playAgain: 'Chơi Lại',
        noScoresYet: 'Chưa có điểm nào!',

        // Validation messages
        alertExactly3Letters: 'Vui lòng nhập đúng 3 chữ cái',
        alertOnlyLetters: 'Vui lòng chỉ nhập chữ cái'
    }
};

// Current language
let currentLanguage = 'vi';

// Translation function
function t(key) {
    const keys = key.split('.');
    let value = STRINGS[currentLanguage];

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return value || key;
}

// Apply translations to HTML elements with data-i18n attribute
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Apply translations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslations);
} else {
    applyTranslations();
}
