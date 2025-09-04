# insights/views.py
from django.shortcuts import render, redirect
from django.urls import reverse
from .questions import QUESTIONNAIRE, score_total, classify

SESSION_KEYS = {
    "answers": "vd_answers",   # list[int|None]
    "result": "vd_result",     # "Adequate"|"Borderline"|"Inadequate"
}

def questionnaire_start(request):
    # initialise answers list equal to number of questions
    request.session[SESSION_KEYS["answers"]] = [None] * len(QUESTIONNAIRE)
    request.session.pop(SESSION_KEYS["result"], None)
    request.session.modified = True
    return redirect(reverse("insights:question", kwargs={"index": 0}))

def questionnaire_question(request, index: int):
    answers = request.session.get(SESSION_KEYS["answers"])
    if answers is None:
        # if session expired or direct access: restart
        return redirect("insights:questionnaire_start")

    qcount = len(QUESTIONNAIRE)
    index = max(0, min(index, qcount - 1))
    question = QUESTIONNAIRE[index]
    selected = answers[index]

    if request.method == "POST":
        action = request.POST.get("action")
        # save selected option if provided
        chosen = request.POST.get("option")
        if chosen is not None:
            answers[index] = int(chosen)
            request.session[SESSION_KEYS["answers"]] = answers
            request.session.modified = True

        if action == "back":
            prev_idx = max(0, index - 1)
            return redirect("insights:question", index=prev_idx)

        if action in ("next", "finish"):
            next_idx = index + 1
            if next_idx < qcount:
                return redirect("insights:question", index=next_idx)
            # finished → compute and store result
            total = score_total(answers)
            request.session[SESSION_KEYS["result"]] = classify(total)
            request.session.modified = True
            return redirect("insights:questionnaire_result")

    # GET or invalid POST → render the form
    return render(request, "insights/question.html", {
        "index": index,
        "count": len(QUESTIONNAIRE),
        "question": question,
        "selected": selected,
        "is_last": index == qcount - 1,
    })

def questionnaire_result(request):
    result = request.session.get(SESSION_KEYS["result"])
    answers = request.session.get(SESSION_KEYS["answers"])
    if not answers:
        return redirect("insights:questionnaire_start")
    total = score_total(answers) if result else None
    return render(request, "insights/result.html", {
        "result": result,
        "total": total,
        "answers": answers,
        "questions": QUESTIONNAIRE,
    })



def hub(request):
    last_result = request.session.get(SESSION_KEYS["result"])
    return render(request, "insights/hub.html", {"last_result": last_result})




def disclaimer(request):
    return render(request, "insights/disclaimer.html")

def learn_more(request):
    last_result = request.session.get(SESSION_KEYS["result"])
    return render(request, "insights/learn_more.html", {"last_result": last_result})



from news_scraper.models import Article


def article_list(request):
    qs = Article.objects.filter(has_keywords=True)

    keyword = request.GET.get('keyword')
    if keyword:
        qs = qs.filter(keywords_found__icontains=keyword)

    source = request.GET.get('source')
    if source:
        qs = qs.filter(source_domain__icontains=source)

    # Prepare articles and tag list for template (avoid calling .split in template)
    articles = list(qs.order_by('-date_published')[:60])
    for a in articles:
        raw = a.keywords_found or ""
        a.tag_list = [t.strip() for t in raw.split(",") if t.strip()]

    # Source list for the filter (exclude blanks/nulls)
    sources = (
        Article.objects
        .exclude(source_domain__isnull=True)
        .exclude(source_domain__exact="")
        .values_list('source_domain', flat=True)
        .distinct()
        .order_by('source_domain')
    )

    context = {
        'articles': articles,
        'keywords': [
            ("vitamin d", "Vitamin D"),
            ("vitamin d3", "Vitamin D3"),
            ("sun exposure", "Sun exposure"),
            ("uv index", "UV index"),
            ("cognitive", "Cognitive"),
            ("dementia", "Dementia"),
        ],
        'sources': sources,
        'selected_keyword': keyword,
        'selected_source': source,
    }
    return render(request, "articles/list.html", context)
