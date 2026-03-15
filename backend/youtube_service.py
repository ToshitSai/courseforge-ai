import os
import httpx
from typing import Optional

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

async def search_youtube_video(query: str, lesson_title: str, language: str = "English") -> Optional[dict]:
    """
    Search YouTube for a video relevant to the lesson topic.
    Returns video metadata including embed URL.
    """
    import asyncio
    
    # Use official API if key exists and isn't the dummy string
    if YOUTUBE_API_KEY and YOUTUBE_API_KEY != "your_youtube_data_api_key_here":
        lang_suffix = "" if language.lower() == "english" else f" in {language}"
        search_query = f"{query} {lesson_title} tutorial explained{lang_suffix}"
        params = {
            "key": YOUTUBE_API_KEY,
            "q": search_query,
            "part": "snippet",
            "type": "video",
            "maxResults": 1,
            "videoEmbeddable": "true",
            "relevanceLanguage": "en",
            "safeSearch": "strict",
            "order": "relevance",
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(YOUTUBE_SEARCH_URL, params=params)
                data = response.json()
            if "items" in data and len(data["items"]) > 0:
                item = data["items"][0]
                video_id = item["id"]["videoId"]
                snippet = item["snippet"]
                return {
                    "videoId": video_id,
                    "title": snippet["title"],
                    "channelTitle": snippet["channelTitle"],
                    "thumbnail": snippet["thumbnails"]["medium"]["url"],
                    "embedUrl": f"https://www.youtube.com/embed/{video_id}",
                    "watchUrl": f"https://www.youtube.com/watch?v={video_id}",
                }
        except Exception as e:
            print(f"YouTube API error: {repr(e)}")

    # Fallback to youtube-search-python library if API key fails or is missing
    return await scrape_youtube(query, lesson_title, language)


async def scrape_youtube(query: str, lesson_title: str, language: str = "English") -> dict:
    import urllib.parse
    import re
    import json
    import httpx
    
    lang_suffix = "" if language.lower() == "english" else f" in {language}"
    search_query = f"{query} {lesson_title} tutorial explained{lang_suffix}"
    encoded_query = urllib.parse.quote(search_query)
    url = f"https://www.youtube.com/results?search_query={encoded_query}"
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"})
            html = res.text
            
        # We look for ytInitialData assigned to window object
        match = re.search(r"var ytInitialData = ({.*?});<\/script>", html)
        if match:
            initial_data = json.loads(match.group(1))
            try:
                # The deeply nested path to the first video result
                contents = initial_data["contents"]["twoColumnSearchResultsRenderer"]["primaryContents"]["sectionListRenderer"]["contents"]
                
                # Iterate until we find actual video results (ignoring ads/promos)
                for item in contents:
                    if "itemSectionRenderer" in item:
                        results = item["itemSectionRenderer"].get("contents", [])
                        for result in results:
                            if "videoRenderer" in result:
                                video = result["videoRenderer"]
                                video_id = video.get("videoId")
                                title = video.get("title", {}).get("runs", [{}])[0].get("text", "")
                                channel = video.get("ownerText", {}).get("runs", [{}])[0].get("text", "")
                                if video_id:
                                    return {
                                        "videoId": video_id,
                                        "title": title,
                                        "channelTitle": channel,
                                        "thumbnail": f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg",
                                        "embedUrl": f"https://www.youtube.com/embed/{video_id}",
                                        "watchUrl": f"https://www.youtube.com/watch?v={video_id}",
                                    }
            except KeyError as ke:
                print(f"KeyError parsing ytInitialData: {repr(ke)}")
    except Exception as e:
        print(f"Scrape error: {repr(e)}")
        
    return get_fallback_video(lesson_title)


def get_fallback_video(lesson_title: str) -> dict:
    """Return a generic educational video if all else fails."""
    # A generic coding video as a last resort instead of a Rickroll
    return {
        "videoId": "PkZNo7MF68",
        "title": f"Web Development Tutorial",
        "channelTitle": "Educational Channel",
        "thumbnail": "https://img.youtube.com/vi/PkZNo7MF68/mqdefault.jpg",
        "embedUrl": "https://www.youtube.com/embed/PkZNo7MF68",
        "watchUrl": "https://www.youtube.com/watch?v=PkZNo7MF68",
    }
