import os
import json
import time
from datetime import datetime
from typing import Any, Dict, List

class ContextManager:
    """
    Manages the 'input flow' and execution context for each search request.
    Stores logs in a structured format to allow debugging and auditing of past events.
    """
    def __init__(self, storage_dir: str = None):
        if storage_dir is None:
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.storage_dir = os.path.join(BASE_DIR, "data", "context")
        else:
            self.storage_dir = storage_dir
            
        if not os.path.exists(self.storage_dir):
            os.makedirs(self.storage_dir)
        self.current_context: Dict[str, Any] = {}

    def start_request(self, business_name: str, location: str = ""):
        self.request_id = f"req_{int(time.time())}"
        self.current_context = {
            "request_id": self.request_id,
            "timestamp": datetime.now().isoformat(),
            "input": {
                "business_name": business_name,
                "location": location
            },
            "steps": []
        }
        self.log_step("request_started", f"Started processing reviews for {business_name}")

    def log_step(self, step_name: str, message: str, data: Any = None):
        step = {
            "timestamp": datetime.now().isoformat(),
            "step": step_name,
            "message": message,
            "data": data
        }
        self.current_context["steps"].append(step)
        print(f"[{step_name.upper()}] {message}")
        self._save_context()

    def _save_context(self):
        file_path = os.path.join(self.storage_dir, f"{self.request_id}.json")
        with open(file_path, "w") as f:
            json.dump(self.current_context, f, indent=4)

    def finalize_request(self, summary: str):
        self.log_step("request_finalized", "Completed summary generation", {"summary": summary})

    def get_history(self) -> List[Dict[str, Any]]:
        history = []
        for filename in sorted(os.listdir(self.storage_dir), reverse=True):
            if filename.endswith(".json"):
                with open(os.path.join(self.storage_dir, filename), "r") as f:
                    history.append(json.load(f))
        return history

# Global instance
context_manager = ContextManager()
