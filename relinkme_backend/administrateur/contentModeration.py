from transformers import pipeline

print("Loading model... this may take a moment.")
GLOBAL_CLASSIFIER = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
print("Model loaded successfully!")
def text_content_moderation(value):
    sequence_to_classify = "The protestant church of St Louis is looking for a christian gardener aged between 25 ans 40 years old to work from 9 to 5."
    candidate_labels = [
        'Direct Job Opportunity or Career Recruitment or Career related content',
        'Personal General Social Media Post',
        'General Business News or Market Update',
        'Non-Job related Marketing or Sales Pitch',
        'Religious or political opinion',
        'Harmful and sexual content'
    ]
    candidate_label = [
        'Career and Professional Content, Achievements, or Job Listings',
        'Casual, Personal, or Non-work Related Social Post',
        'General News, Politics, or Entertainment Content'
    ]
    labels = [
        "Job Opportunity",
        "Work-related productivity content",
        "Recruitment or Hiring Post",
        "Career Advice or Tips",
        "Business or Market News",
        "Harmful or Sexual Content",
        "Personal or Social Post",
        "Not work-related Religious or political opinion",
        "Sales Content",
        "Other / Irrelevant"
    ]

    result = GLOBAL_CLASSIFIER(sequence_to_classify,labels, multi_label=False)
    top_class = result['labels'][0]
    top_score = result['scores'][0]
    target_class = 'Career and Professional Content, Achievements, or Job Listings'
    print(result)
    print(result['labels'][0])

    if top_class == target_class and top_score >= 0.85:
        print("true")
        return True
    else:
        print("false")
        return False

text_content_moderation("hello")