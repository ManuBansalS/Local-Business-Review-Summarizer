import os
import requests
from dotenv import load_dotenv
from app.utils.context_manager import context_manager

load_dotenv()

class SearchService:
    """
    Service to fetch business info and reviews using Serper API.
    """
    def __init__(self):
        self.api_key = os.getenv("SERPER_API_KEY")
        self.base_url = "https://google.serper.dev/places"

    def fetch_reviews(self, business_name: str, location: str = ""):
        context_manager.log_step("search_started", f"Searching for reviews of {business_name} in Serper")
        
        query = f"{business_name} {location}".strip()
        headers = {
            'X-API-KEY': self.api_key,
            'Content-Type': 'application/json'
        }
        payload = {
            'q': query
        }

        try:
            response = requests.post(self.base_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Extract places
            places = data.get("places", [])
            if not places:
                context_manager.log_step("search_failed", "No places found for the given query")
                return []

            # Focus on the first relevant place
            target_place = places[0]
            cid = target_place.get("cid")
            place_id = target_place.get("placeId")
            
            reviews = []
            if cid or place_id:
                reviews_url = "https://google.serper.dev/reviews"
                reviews_payload = {}
                if cid:
                    reviews_payload["cid"] = cid
                else:
                    reviews_payload["placeId"] = place_id
                
                rev_response = requests.post(reviews_url, headers=headers, json=reviews_payload)
                if rev_response.status_code == 200:
                    rev_data = rev_response.json()
                    reviews = rev_data.get("reviews", [])
                else:
                    context_manager.log_step("search_reviews_failed", f"Failed to fetch reviews: {rev_response.text}")
            
            context_manager.log_step("search_completed", f"Found {len(reviews)} reviews for {target_place.get('title')}", {
                "business_title": target_place.get("title"),
                "rating": target_place.get("rating"),
                "review_count": target_place.get("ratingCount")
            })
            
            # Standardize review format
            formatted_reviews = [
                {
                    "text": r.get("snippet", ""),
                    "rating": r.get("rating", 0),
                    "date": r.get("date", "Unknown")
                }
                for r in reviews if r.get("snippet")
            ]
            
            return formatted_reviews

        except Exception as e:
            context_manager.log_step("search_error", f"Error fetching reviews: {str(e)}")
            return []

# Singleton instance
search_service = SearchService()
