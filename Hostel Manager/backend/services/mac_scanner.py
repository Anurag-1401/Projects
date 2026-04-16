import time
import subprocess
import re
import platform
import socket
from tracemalloc import start

def get_network_prefix():
    hostname = socket.gethostname()
    ip = socket.gethostbyname(hostname)
    prefix = ".".join(ip.split(".")[:3])
    print(f"🌐 Detected Network Prefix: {prefix}")
    return prefix


def normalize_mac(mac: str) -> str:
    """
    Convert MAC to standard format: aa:bb:cc:dd:ee:ff
    """
    return mac.lower().replace("-", ":")

network = get_network_prefix()

def ping_sweep():
    print(f"📡 Starting ping sweep on {network}.x ...")
    for i in range(1, 50):  # 🔥 reduced for faster debug
        ip = f"{network}.{i}"
        subprocess.call(
            f"ping -n 1 -w 100 {ip}",
            shell=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )    
    
    print(f"⏱ Ping sweep completed")

def get_connected_macs():
    try:
        print("\n🚀 MAC SCANNER STARTED")
        system = platform.system()

        ping_sweep()

        # 🔹 Run correct command based on OS
        if system == "Windows":
            command = "arp -a"
        else:
            command = "arp -n"

        output = subprocess.check_output(command, shell=True).decode(errors="ignore")

        print("\n📄 ARP OUTPUT (first 500 chars):")
        print(output[:500])  # 🔍 Print first 500 chars for debugging
        # 🔹 Extract MAC addresses (supports - and :)
        macs = re.findall(r"(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}", output)
        print(f"\n🔍 Extracted MACs (raw): {macs}")
        # 🔹 Normalize and remove duplicates
        normalized_macs = list(set(normalize_mac(m) for m in macs))
        print(f"\n✅ Normalized MACs: {normalized_macs}")
        
        return normalized_macs

    except Exception as e:
        print("❌ Error scanning MACs:", e)
        return []