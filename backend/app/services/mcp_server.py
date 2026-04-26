import os
import json
from datetime import datetime
from app.utils.context_manager import context_manager
from app.services.search_service import search_service

class MCPServer:
    """
    Model Context Protocol (MCP) Bridge.
    Standardizes the data ingestion flow and stores raw data.
    """
    def __init__(self, raw_data_dir: str = None):
        if raw_data_dir is None:
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.raw_data_dir = os.path.join(BASE_DIR, "data", "raw")
        else:
            self.raw_data_dir = raw_data_dir
            
        if not os.path.exists(self.raw_data_dir):
            os.makedirs(self.raw_data_dir)

    def execute_tool(self, tool_name: str, arguments: dict):
        """
        Executes a specific MCP tool.
        """
        if tool_name == "fetch_business_reviews":
            return self.fetch_and_store_reviews(arguments.get("business_name"), arguments.get("location", ""))
        else:
            raise ValueError(f"Unknown tool: {tool_name}")

    def fetch_and_store_reviews(self, business_name: str, location: str):
        context_manager.log_step("mcp_ingestion_started", f"MCP Tool: fetch_business_reviews triggered for {business_name}")
        
        # 1. Check Cache
        cache_filename = f"{business_name.replace(' ', '_')}_{location.replace(' ', '_')}_cache.json"
        cache_path = os.path.join(self.raw_data_dir, cache_filename)
        
        if os.path.exists(cache_path):
            try:
                with open(cache_path, "r") as f:
                    cached_data = json.load(f)
                
                fetched_at_str = cached_data.get("fetched_at")
                if fetched_at_str:
                    fetched_at = datetime.fromisoformat(fetched_at_str)
                    if (datetime.now() - fetched_at).days < 30:
                        context_manager.log_step("mcp_cache_hit", "Using cached reviews from the last 30 days")
                        return cached_data.get("reviews", []), True
            except Exception as e:
                context_manager.log_step("mcp_cache_error", f"Error reading cache: {e}")

        # 2. Fetch from search service if not cached
        reviews = search_service.fetch_reviews(business_name, location)
        
        if not reviews:
            context_manager.log_step("mcp_ingestion_empty", "No reviews were fetched by MCP")
            return [], False

        # 3. Store as raw data
        raw_payload = {
            "business_name": business_name,
            "location": location,
            "fetched_at": datetime.now().isoformat(),
            "reviews": reviews
        }
        
        with open(cache_path, "w") as f:
            json.dump(raw_payload, f, indent=4)
            
        context_manager.log_step("mcp_raw_storage", f"Stored raw review data in {cache_path}")
        
        return reviews, False

# Singleton instance
mcp_server = MCPServer()
