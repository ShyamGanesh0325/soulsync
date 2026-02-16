from textblob import TextBlob

def analyze_bio(text: str) -> float:
    """
    Analyzes the sentiment of the bio text.
    Returns a polarity score between -1.0 and 1.0.
    """
    if not text:
        return 0.0
    blob = TextBlob(text)
    return blob.sentiment.polarity
