import subprocess
import sys
from dotenv import load_dotenv 
from pathlib import Path

root_backend_path = Path(__file__).parent.parent.absolute()
print(root_backend_path)

if len(sys.argv) > 1 and sys.argv[1] == "remote_db":
    env_path = root_backend_path / Path(".env.db.remote")
else:
    env_path = root_backend_path / Path(".env.db.local") 

load_dotenv(env_path)

collect_cmd = "python3 " + str(root_backend_path / Path("manage.py")) + " collectstatic"
subprocess.run(collect_cmd.split(" "))
# print(collect_cmd)