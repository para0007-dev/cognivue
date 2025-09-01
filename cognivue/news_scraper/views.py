from django.shortcuts import render
from .models import Article

def article_list(request):
    articles = Article.objects.filter(has_keywords=True)
    
    # Filter by keyword if provided
    keyword = request.GET.get('keyword')
    if keyword:
        articles = articles.filter(keywords_found__icontains=keyword)
    
    # Filter by source if provided
    source = request.GET.get('source')
    if source:
        articles = articles.filter(source_domain__icontains=source)
    
    context = {
        'articles': articles,
        'keywords': ['technology', 'ai', 'software', 'innovation', 'cybersecurity'],
        'sources': Article.objects.values_list('source_domain', flat=True).distinct(),
        'selected_keyword': keyword,
        'selected_source': source,
    }
    context["vd_result"] = request.session.get("vd_result")
    return render(request, 'news_scraper/article_list.html', context)