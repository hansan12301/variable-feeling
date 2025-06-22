const API_KEY = config.apikey;

// 감정 분석 요청 함수 (Hugging Face API 호출)
async function analyze(text) {
    const response = await fetch(
    "https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis",
    {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: text })
    }
    );

    try {
    const result = await response.json();

      // 2중 배열이므로 첫 번째 요소만 추출
    console.log("Hugging Face API 응답:", result);

    if (
        Array.isArray(result) &&
        Array.isArray(result[0]) &&
        result[0].length > 0
    ) {
        const scores = result[0];
        const top = scores.reduce((a, b) => (a.score > b.score ? a : b));
        return top.label;
    } else {
        return "알 수 없음";
    }
    } catch (e) {
        console.error("JSON 파싱 실패:", e);
        return "알 수 없음";
    }
}


function applyTypography(emotion) {
    const el = document.getElementById("text");

    const emotionColors = {
        "Very Positive": "#ffd600", // 노랑
        "Positive": "#00c853",      // 초록
        "Neutral": "#9e9e9e",       // 회색
        "Negative": "#d32f2f",      // 빨강
        "Very Negative": "#b71c1c", // 진한 빨강
        "알 수 없음": "#000000"
    };

    const emotionStyleMap = {
        "Very Positive": { wdth: 900, glat: 1000 },
        "Positive":      { wdth: 800, glat: 500 },
        "Neutral":       { wdth: 850, glat: 500 },
        "Negative":      { wdth: 1000, glat: 300 },
        "Very Negative": { wdth: 1000, glat: 0 },
        "알 수 없음":     { wdth: 1000, glat: 500 }
    };

    const color = emotionColors[emotion] || "#000000";
    const style = emotionStyleMap[emotion] || emotionStyleMap["알 수 없음"];
    const fontSettings = `"wdth" ${style.wdth}, "GLAT" ${style.glat}`;

    // 스타일 적용
    el.style.color = color;
    el.style.fontVariationSettings = fontSettings;

    const safeClassName = `emotion-${emotion.replace(/\s/g, '-')}`;

    // class 초기화 후 reflow 트리거 → class 재적용
    el.classList.remove(...el.classList);
    void el.offsetWidth;
    el.classList.add(safeClassName);

    // 감정 텍스트를 h1에 출력
    const labelEl = document.querySelector(".label h1");
    labelEl.textContent = `${emotion}`;

    console.log(`감정: ${emotion}`);
}

document.addEventListener("DOMContentLoaded", () => {
    const textEl = document.getElementById("text");
    let timeout;

    textEl.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const text = textEl.innerText.trim();
            if (text.length > 0) {
                const emotion = await analyze(text);
                applyTypography(emotion);
            }
        }, 500);
    });
});