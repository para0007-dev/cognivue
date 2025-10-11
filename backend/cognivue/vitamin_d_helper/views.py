import json
import requests
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.conf import settings
from .models import UserProfile, SkinType
from .forms import SkinTypeForm, CityForm
from math import ceil
import datetime as dt
from django.views.decorators.http import require_GET

# [Previous functions remain the same: vitamin_d_helper, get_weather_data, etc.]

@login_required
def vitamin_d_helper(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    # Handle skin type form submission
    if 'skin_type_submit' in request.POST:
        form = SkinTypeForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('vitamin_d_helper')
    else:
        form = SkinTypeForm(instance=profile)
    
    # Handle city form submission
    if 'city_submit' in request.POST:
        city_form = CityForm(request.POST, instance=profile)
        if city_form.is_valid():
            profile.latitude = None
            profile.longitude = None
            city_form.save()
            return redirect('vitamin_d_helper')
    else:
        city_form = CityForm(instance=profile)
    
    weather_data = get_weather_data(profile)
    
    recommendation = None
    if profile.skin_type:
        recommendation = {
            'min_minutes': profile.skin_type.min_exposure_minutes,
            'max_minutes': profile.skin_type.max_exposure_minutes
        }
    
    timer_seconds = None
    if recommendation:
        timer_seconds = recommendation['max_minutes'] * 60

    context = {
        'form': form,
        'city_form': city_form,
        'weather_data': weather_data,
        'recommendation': recommendation,
        'is_good_conditions': is_good_conditions(weather_data) if weather_data else False,
        'has_location': profile.has_location(),
        'profile': profile,
        'timer_seconds': timer_seconds,
    }
    
    return render(request, 'vitamin_d_helper.html', context)


def get_weather_data(profile):
    """Get weather data for Australian locations"""
    try:
        if profile.has_location():
            print("Using coordinates from geolocation")
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {
                'lat': profile.latitude,
                'lon': profile.longitude,
                'appid': settings.OPENWEATHER_API_KEY,
                'units': 'metric'
            }
        elif profile.city:
            print(f"Using manual city: {profile.city}")
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {
                'q': f"{profile.city},AU",
                'appid': settings.OPENWEATHER_API_KEY,
                'units': 'metric'
            }
        else:
            print("Using default location: Melbourne")
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {
                'q': 'Melbourne,AU',
                'appid': settings.OPENWEATHER_API_KEY,
                'units': 'metric'
            }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        uv_index = get_uv_index(data['coord']['lat'], data['coord']['lon'])

        return {
            'location': f"{data['name']}, Australia",
            'condition': data['weather'][0]['description'].title(),
            'temp': round(data['main']['temp']),
            'uv_index': uv_index,
            'humidity': data['main']['humidity'],
        }

    except Exception as e:
        print(f"Weather API error: {e}")
        return None


def get_uv_index(lat, lon):
    """Get UV index using OpenWeather's One Call API"""
    try:
        url = "https://api.openweathermap.org/data/3.0/onecall"
        params = {
            'lat': lat,
            'lon': lon,
            'exclude': 'minutely,hourly,daily,alerts',
            'appid': settings.OPENWEATHER_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        return ceil(data.get('current', {}).get('uvi', 0))
        
    except:
        return 0


def is_good_conditions(weather_data):
    """Determine if conditions are good for sun exposure"""
    uv_index = weather_data.get('uv_index', 0)
    return 3 <= uv_index <= 7


@login_required
@require_POST
@csrf_exempt
def update_location_from_coords(request):
    """AJAX endpoint to update user location from coordinates"""
    try:
        data = json.loads(request.body)
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
        
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        profile.latitude = latitude
        profile.longitude = longitude
        
        city, country = reverse_geocode(latitude, longitude)
        if city:
            profile.city = city
        if country:
            profile.country = country
        
        profile.save()
        
        return JsonResponse({
            'success': True, 
            'message': 'Location updated successfully',
            'city': city,
            'country': country
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False, 
            'error': str(e)
        })


def reverse_geocode(lat, lon):
    """Reverse geocode coordinates to get city and country"""
    try:
        url = "http://api.openweathermap.org/geo/1.0/reverse"
        params = {
            'lat': lat,
            'lon': lon,
            'limit': 1,
            'appid': settings.OPENWEATHER_API_KEY
        }
        
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        if data and len(data) > 0:
            return data[0].get('name'), data[0].get('country')
            
    except:
        pass
    
    return None, None


@require_GET
def weather_summary(request):
    lat = request.GET.get("lat")
    lon = request.GET.get("lon")
    city = request.GET.get("city")

    if lat and lon:
        try:
            data = get_weather_data_from(float(lat), float(lon))
            return JsonResponse(data)
        except Exception:
            return JsonResponse({"error": "Weather unavailable"}, status=502)

    if city:
        try:
            data = get_weather_data_by_city(city)
            return JsonResponse(data)
        except Exception:
            return JsonResponse({"error": "Weather unavailable"}, status=502)

    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    data = get_weather_data(profile)
    if not data:
        return JsonResponse({"error": "Weather unavailable"}, status=502)
    data.update({"has_location": profile.has_location(), "city": profile.city or ""})
    return JsonResponse(data)


def get_weather_data_from(lat: float, lon: float):
    """Weather + UV by coordinates"""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"lat": lat, "lon": lon, "appid": settings.OPENWEATHER_API_KEY, "units": "metric"}
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()
    uv_index = get_uv_index(data['coord']['lat'], data['coord']['lon'])
    return {
        'location': f"{data['name']}, Australia",
        'condition': data['weather'][0]['description'].title(),
        'temp': round(data['main']['temp']),
        'uv_index': uv_index,
        'humidity': data['main']['humidity'],
    }


def get_weather_data_by_city(city: str):
    """Weather + UV by city string. Accepts 'Carlton, AU' or 'Carlton'"""
    q = city.strip()
    if ',' not in q:
        q = f"{q},AU"

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"q": q, "appid": settings.OPENWEATHER_API_KEY, "units": "metric"}
    r = requests.get(url, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()
    uv_index = get_uv_index(data['coord']['lat'], data['coord']['lon'])
    name = data.get('name') or q.split(',')[0].strip()
    country = data.get('sys', {}).get('country') or 'AU'
    return {
        'location': f"{name}, {country}",
        'condition': data['weather'][0]['description'].title(),
        'temp': round(data['main']['temp']),
        'uv_index': uv_index,
        'humidity': data['main']['humidity'],
    }


# ============================================================================
# IMPROVED FORECAST ENDPOINT
# ============================================================================

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

def _parse_float(qs, key, default=None):
    """Safely parse float from query string"""
    try:
        return float(qs.get(key, default))
    except (TypeError, ValueError):
        return default


def weather_code_to_condition(code):
    """
    Convert Open-Meteo weather code to human-readable condition
    Full mapping: https://open-meteo.com/en/docs
    """
    try:
        code = int(code or 0)
    except (TypeError, ValueError):
        return "Unknown"
    
    mapping = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
    }
    return mapping.get(code, "Unknown")


@csrf_exempt
@require_GET
def weather_forecast(request):
    """
    Returns a normalized 7-day *hourly* forecast:
    {
      "days": [
        { "dateISO": "2025-10-10",
          "hours": [
            { "timeISO": "2025-10-10T07:00:00", "uv": 1.2, "condition": "Clear", "tempC": 16.3 },
            ...
          ]
        }, ...
      ]
    }
    Query params:
      - lat, lon (preferred)
      - city (fallback: geocodes via Open-Meteo)
    """
    lat = _parse_float(request.GET, "lat")
    lon = _parse_float(request.GET, "lon")
    city = request.GET.get("city")

    # Resolve city → (lat, lon) if needed
    if lat is None or lon is None:
        if not city:
            return JsonResponse({"error": "Provide lat/lon or city"}, status=400)
        
        try:
            # Use Open-Meteo's free geocoding API
            geo = requests.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={"name": city, "count": 1, "language": "en"},
                timeout=10,
            )
            geo.raise_for_status()
            
            results = geo.json().get("results")
            if not results or len(results) == 0:
                return JsonResponse({
                    "error": f"City '{city}' not found. Please try a larger city nearby.",
                    "suggestion": "Try searching for a major city or include country code (e.g., 'Carlton, AU')"
                }, status=404)
            
            item = results[0]
            lat = float(item["latitude"])
            lon = float(item["longitude"])
            resolved_name = item.get("name", city)
            
            print(f"Geocoded '{city}' → {resolved_name} ({lat}, {lon})")
            
        except requests.RequestException as e:
            return JsonResponse({
                "error": f"Geocoding service error: {str(e)}",
                "suggestion": "Please try again or use latitude/longitude"
            }, status=502)
        except Exception as e:
            return JsonResponse({
                "error": f"Geocoding failed: {str(e)}"
            }, status=500)

    # Fetch 7-day hourly forecast from Open-Meteo
    try:
        print(f"Fetching forecast for coordinates: ({lat}, {lon})")
        
        r = requests.get(
            OPEN_METEO_URL,
            params={
                "latitude": lat,
                "longitude": lon,
                "hourly": "temperature_2m,uv_index,weather_code",
                "timezone": "auto",  # Returns local time for the location
                "forecast_days": 7,
            },
            timeout=15,
        )
        r.raise_for_status()
        data = r.json()
        
    except requests.RequestException as e:
        return JsonResponse({
            "error": f"Weather service unavailable: {str(e)}",
            "suggestion": "Please try again in a moment"
        }, status=502)
    except Exception as e:
        return JsonResponse({
            "error": f"Forecast fetch failed: {str(e)}"
        }, status=500)

    # Validate response structure
    hourly = data.get("hourly", {})
    if not hourly:
        return JsonResponse({
            "error": "No forecast data available for this location",
            "suggestion": "This location may not have detailed weather data. Try a larger nearby city."
        }, status=404)

    times = hourly.get("time", [])
    temps = hourly.get("temperature_2m", [])
    uvs = hourly.get("uv_index", [])
    codes = hourly.get("weather_code", [])

    if not times or len(times) == 0:
        return JsonResponse({
            "error": "No hourly forecast data returned",
            "suggestion": "Try a different location"
        }, status=404)

    print(f"Received {len(times)} hourly data points")

    # Group by day and format
    days = {}
    for i, t in enumerate(times):
        # Open-Meteo returns local time like "2025-10-10T07:00"
        # We need to ensure it's properly formatted for JavaScript Date parsing
        date_part = t[:10]  # YYYY-MM-DD
        
        # Get timezone info from the response
        timezone = data.get("timezone", "UTC")
        
        # Add timezone suffix if missing (for proper ISO format)
        time_iso = t if 'T' in t else f"{t}T00:00:00"
        
        days.setdefault(date_part, []).append({
            "timeISO": time_iso,
            "uv": round(float(uvs[i]), 1) if i < len(uvs) and uvs[i] is not None else 0.0,
            "condition": weather_code_to_condition(codes[i] if i < len(codes) else None),
            "tempC": round(float(temps[i]), 1) if i < len(temps) and temps[i] is not None else None,
        })

    # Build response
    payload = {
        "days": [
            {"dateISO": day, "hours": hours}
            for day, hours in sorted(days.items())
        ],
        "location": {
            "latitude": lat,
            "longitude": lon,
            "timezone": data.get("timezone", "UTC")
        }
    }
    
    print(f"Returning {len(payload['days'])} days of forecast data")
    
    return JsonResponse(payload, safe=False)