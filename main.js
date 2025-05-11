async function analyze(text) {
    const response = await fetch("https://variable-feeling.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const result = await response.json();
    return result.label; // 예: 0, 1, 2, ...
}

function applyTypography(label) {
    const el = document.getElementById("text");
    label = Number(label);

    const label2emotion = {
        0: "긍정",
        1: "당황",
        2: "분노",
        3: "불안",
        4: "기쁨",
        5: "중립",
        6: "혐오",
        7: "슬픔",
        8: "중립",
        9: "부정",
        10: "불안"
    };

    const emotion = label2emotion[label] || "알 수 없음";

    const emotionColors = {
        "긍정": "#00c853",
        "기쁨": "#ffd600",
        "부정": "#d32f2f",
        "불안": "#607d8b",
        "슬픔": "#1976d2"
    };

    const color = emotionColors[emotion] || "#000000";

    el.style.color = color;

    // 기본 스타일 유지하면서 색상만 반영
    el.style.fontVariationSettings = `"GLAT" 700, "wdth" 900`;

    // 감정 이름도 보여주기 (선택)
    console.log(`감정: ${emotion}`);
    console.log("LABEL", label, typeof label);

}


document.addEventListener("DOMContentLoaded", () => {
    const textEl = document.getElementById("text");
    let timeout;

    textEl.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const text = textEl.innerText.trim();
            if (text.length > 0) {
                const label = await analyze(text);
                applyTypography(label);
            }
        }, 500);
    });
});
