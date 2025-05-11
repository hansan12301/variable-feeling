from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ 추가
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)
CORS(app)  # ✅ CORS 허용

model_name = "nlp04/korean_sentiment_analysis_kcelectra"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    text = data.get("text", "")

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():  # ✅ 이걸 반드시 써줘야 멈추지 않음
        outputs = model(**inputs)

    logits = outputs.logits.detach().numpy().tolist()[0]
    predicted = int(torch.argmax(outputs.logits).item())

    return jsonify({
        "label": predicted,
        "logits": logits
    })


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)