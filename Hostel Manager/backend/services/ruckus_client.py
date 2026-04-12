import requests
from config import (
    RUCKUS_BASE_URL,
    RUCKUS_USERNAME,
    RUCKUS_PASSWORD,
    RUCKUS_VERIFY_SSL
)


def normalize_mac(mac: str) -> str:
    return mac.lower().replace("-", ":")


def get_connected_macs_from_ruckus():
    try:
        print("🚀 Fetching devices from Ruckus Controller...")

        session = requests.Session()

        # 🔐 STEP 1: LOGIN (dummy endpoint)
        login_url = f"{RUCKUS_BASE_URL}/login"

        login_payload = {
            "username": RUCKUS_USERNAME,
            "password": RUCKUS_PASSWORD
        }

        login_res = session.post(
            login_url,
            json=login_payload,
            verify=RUCKUS_VERIFY_SSL
        )

        print("🔐 Login Status:", login_res.status_code)

        # 🔹 STEP 2: FETCH CLIENTS (dummy endpoint)
        clients_url = f"{RUCKUS_BASE_URL}/clients"

        response = session.get(
            clients_url,
            verify=RUCKUS_VERIFY_SSL
        )

        print("📡 Fetch Status:", response.status_code)

        data = response.json()

        # 🔥 Expected format:
        # data = [{"mac": "...", "ip": "..."}]

        macs = []

        for client in data:
            if "mac" in client:
                macs.append(normalize_mac(client["mac"]))

        print("✅ Connected MACs:", macs)

        return list(set(macs))

    except Exception as e:
        print("❌ Error fetching from Ruckus:", e)
        return []