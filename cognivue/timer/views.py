from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

def timer_page(request):
    """Main timer page"""
    return render(request, 'timer/timer.html')

@csrf_exempt
def start_timer(request):
    """API endpoint to start timer"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            duration = int(data.get('duration', 0))
            
            # Here you could save to database if user is authenticated
            # if request.user.is_authenticated:
            #     TimerSession.objects.create(user=request.user, duration=duration)
            
            return JsonResponse({
                'success': True,
                'duration': duration,
                'message': f'Timer started for {duration} seconds'
            })
        except (ValueError, TypeError):
            return JsonResponse({'success': False, 'error': 'Invalid duration'})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})