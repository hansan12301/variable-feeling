// Hugging Face API 토큰
const value = "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"; // Read-only Token

// 감정 분석 요청 함수 (Hugging Face API 호출)
async function analyze(text) {
    const response = await fetch(
    "https://api-inference.huggingface.co/models/tabularisai/multilingual-sentiment-analysis",
    {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${value}`,
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
        "알 수 없음": "#000000"     // 검정
    };

    const color = emotionColors[emotion] || "#000000";

    el.style.color = color;
    el.style.fontVariationSettings = `"GLAT" 700, "wdth" 900`;

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
