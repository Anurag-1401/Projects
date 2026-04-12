import os
from dotenv import load_dotenv

load_dotenv()

RUCKUS_BASE_URL = os.getenv("RUCKUS_BASE_URL")
RUCKUS_USERNAME = os.getenv("RUCKUS_USERNAME")
RUCKUS_PASSWORD = os.getenv("RUCKUS_PASSWORD")
RUCKUS_VERIFY_SSL = os.getenv("RUCKUS_VERIFY_SSL", "false").lower() == "true"