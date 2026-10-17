import json
import re
import urllib.request
from pathlib import Path

MODEL = "truckfixhub:latest"
OLLAMA_URL = "http://localhost:11434/api/generate"
CATALOG_FILE = Path("rag-knowledge.json")
TOP_K = 4

STOP_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from",
    "has", "have", "i", "in", "is", "it", "my", "of", "on", "or", "the",
    "this", "to", "was", "what", "when", "where", "which", "with", "will",
    "wont", "won't", "would", "you"
}


def tokens(text):
    words = re.findall(r"[a-z0-9]+", text.lower())
    return [word for word in words if len(word) > 1 and word not in STOP_WORDS]


def score_document(question, document):
    query = set(tokens(question))
    title = set(tokens(document.get("title", "")))
    tags = set(tokens(" ".join(document.get("tags", []))))
    summary = set(tokens(document.get("summary", "")))

    score = 0
    score += 6 * len(query & tags)
    score += 4 * len(query & title)
    score += 2 * len(query & summary)

    q_lower = question.lower()
    for tag in document.get("tags", []):
        if tag.lower() in q_lower:
            score += 8

    return score


def retrieve(question):
    with CATALOG_FILE.open("r", encoding="utf-8") as handle:
        catalog = json.load(handle)

    ranked = []
    for document in catalog.get("documents", []):
        score = score_document(question, document)
        if score > 0:
            ranked.append((score, document))

    ranked.sort(key=lambda item: item[0], reverse=True)
    return ranked[:TOP_K]


def evidence_text(matches):
    blocks = []
    for index, (score, document) in enumerate(matches, start=1):
        blocks.append(
            f"SOURCE {index}\n"
            f"Title: {document.get('title', '')}\n"
            f"Page: {document.get('url', '')}\n"
            f"Verified catalog summary: {document.get('summary', '')}\n"
            f"Retrieval score: {score}"
        )
    return "\n\n".join(blocks)


def ask_ollama(question, matches):
    evidence = evidence_text(matches)
    prompt = f"""
You are the TruckFixHub heavy-duty assistant.
TruckFixHub evidence is your only technical knowledge source for this answer.

STRICT EVIDENCE RULES:
1. Use ONLY facts explicitly stated in TRUCKFIXHUB RETRIEVED EVIDENCE below.
2. Do NOT use general model memory to add technical checks, specifications, components, procedures, fault-code definitions, pressures, voltages, part numbers, or diagnoses.
3. Do NOT convert a broad category such as "fuel-related possibilities" into specific fuel tests unless those tests appear in the evidence.
4. A retrieved page title or tag proves only that the page is relevant; it does not prove a diagnosis.
5. If the evidence does not contain enough detail to answer the question, say exactly what category of information is supported and state that more verified evidence is required for specific next steps.
6. Never diagnose a failed part from insufficient evidence.
7. Keep the answer concise and clearly separate supported evidence from missing information.
8. When useful, identify the TruckFixHub source page(s) that should be consulted next.

TRUCKFIXHUB RETRIEVED EVIDENCE:
{evidence}

USER QUESTION:
{question}

Answer using only the retrieved evidence.
""".strip()

    payload = json.dumps({
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0}
    }).encode("utf-8")

    request = urllib.request.Request(
        OLLAMA_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(request, timeout=300) as response:
        result = json.loads(response.read().decode("utf-8"))
        return result.get("response", "").strip()


def main():
    if not CATALOG_FILE.exists():
        print("TruckFixHub RAG catalog not found: rag-knowledge.json")
        return

    question = input("Ask TruckFixHub: ").strip()
    if not question:
        return

    matches = retrieve(question)
    if not matches:
        print("\nTruckFixHub:\n")
        print("TruckFixHub does not currently have enough verified evidence in the RAG catalog to answer that question safely.")
        return

    print("\nRetrieved TruckFixHub evidence:")
    for score, document in matches:
        print(f"- {document.get('title')} [{document.get('url')}] score={score}")

    try:
        answer = ask_ollama(question, matches)
        print("\nTruckFixHub:\n")
        print(answer)
    except Exception as error:
        print("\nTruckFixHub could not contact the local Ollama model.")
        print("Error:", error)


if __name__ == "__main__":
    main()
