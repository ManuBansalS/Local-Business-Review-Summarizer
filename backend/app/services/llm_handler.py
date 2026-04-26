import os
# from openai import OpenAI
import ollama
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from app.utils.context_manager import context_manager

load_dotenv()

class LLMHandler:
    """
    Handles interactions with Ollama models using the engineered master prompt.
    (OpenAI usage is currently commented out)
    """
    def __init__(self):
        # self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        # self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        # self.model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        # self.api_key = os.getenv("GEMINI_API_KEY")
        # self.llm = ChatGoogleGenerativeAI(model=self.model, google_api_key=self.api_key)

    def generate_summary(self, business_name: str, retrieved_context: list) -> str:
        """
        Executes the master prompt to generate a highly structured summary.
        The prompt is engineered to handle both massive and sparse context arrays safely.
        """
        context_manager.log_step("llm_synthesis_started", f"Generating summary for {business_name} via {self.model}")
        
        context_string = "\n".join(retrieved_context)
        
        system_prompt = """
        You are an elite business intelligence analyst specializing in sentiment analysis and qualitative synthesis. 
        Your objective is to ingest raw user reviews for a specific business and output a concise, perfectly formatted executive summary of the core pros and cons.

        <rules>
        1. GROUNDING: You must ONLY use the information provided in the <context> block. Under no circumstances should you hallucinate or use external knowledge.
        2. NEUTRALITY: Maintain an objective, professional tone. Avoid conversational hyperbole.
        3. SYNTHESIS: Group mathematically similar complaints or praises together. If multiple reviewers mention "slow service", consolidate this into a single strong "Con".
        4. SCALE AGNOSTIC: 
           - If the context is small (e.g., < 5 reviews), explicitly acknowledge the limited sample size in your summary to manage confidence levels.
           - If the context is large, focus exclusively on the highest-frequency, most repeated themes.
        5. FALLBACK: If the <context> is empty or indicates no reviews, you must output: "Insufficient data to generate a valid summary."
        6. FORMATTING: You must output strictly in plain text without any Markdown symbols like # or *. Do not use asterisks for bolding or hashes for headers. Be concise and accurate. Do not add conversational filler before or after the structure.
        </rules>

        <output_format>
        Executive Review Summary:
        
        Overall Sentiment: [A 1-2 sentence high-level overview detailing the consensus]

        Key Strengths (Pros):
        - [Strength 1]
        - [Strength 2]
        - [Strength 3]

        Key Weaknesses (Cons):
        - [Weakness 1]
        - [Weakness 2]
        - [Weakness 3]
        
        Note: Data derived exclusively from localized vector retrieval.
        </output_format>
        """

        user_prompt = f"""
        Business Name: {business_name}
        
        <context>
        {context_string if context_string else "NO REVIEWS FOUND FOR THIS ENTITY."}
        </context>
        
        Execute the analysis based strictly on the rules provided.
        """

        try:
            # response = self.client.chat.completions.create(
            #     model=self.model,
            #     messages=[
            #         {'role': 'system', 'content': system_prompt},
            #         {'role': 'user', 'content': user_prompt},
            #     ]
            # )
            # summary = response.choices[0].message.content
            
            response = ollama.chat(model=self.model, messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt},
            ])
            summary = response['message']['content']
            
            # response = self.llm.invoke([
            #     SystemMessage(content=system_prompt),
            #     HumanMessage(content=user_prompt)
            # ])
            # summary = response.content
            
            context_manager.log_step("llm_synthesis_completed", "Generated final summary successfully")
            return summary

        except Exception as e:
            error_msg = f"Error during LLM synthesis: {str(e)}"
            context_manager.log_step("llm_synthesis_error", error_msg)
            return f"Error generating summary: {str(e)}"

# Singleton instance
llm_handler = LLMHandler()
