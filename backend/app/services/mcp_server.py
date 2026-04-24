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
    def __init__(self, raw_data_dir: str = "backend/data/raw"):
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
        
        # Fetch from search service
        reviews = search_service.fetch_reviews(business_name, location)
        
        if not reviews:
            context_manager.log_step("mcp_ingestion_empty", "No reviews were fetched by MCP")
            return []

        # Store as raw data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{business_name.replace(' ', '_')}_{timestamp}.json"
        file_path = os.path.join(self.raw_data_dir, filename)
        
        raw_payload = {
            "business_name": business_name,
            "location": location,
            "fetched_at": datetime.now().isoformat(),
            "reviews": reviews
        }
        
        with open(file_path, "w") as f:
            json.dump(raw_payload, f, indent=4)
            
        context_manager.log_step("mcp_raw_storage", f"Stored raw review data in {file_path}")
        
        return reviews

# Singleton instance
mcp_server = MCPServer()
