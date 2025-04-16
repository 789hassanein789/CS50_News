from django.core.management.utils import get_random_secret_key
import os

env_defaults = {
    "EMAIL": "your-support-email",
    "EMAIL_PASSWORD": "your-support-email-password",
    "GOOGLE_OAUTH_CLIENT_ID": "your-google-project-client-id",
    "GOOGLE_SECRET": "your-google-project-secret",
    "GITHUB_OAUTH_CLIENT_ID": "your-github-project-client-id",
    "GITHUB_SECRET": "your-github-project-secret",
    "SECRET_KEY": get_random_secret_key(),
}

PROJECT_DIR = "final_project"
ENV_FILE_PATH = os.path.join(PROJECT_DIR, ".env")

def create_env_file():
    if os.path.exists(ENV_FILE_PATH):
        print(f"{ENV_FILE_PATH} already exists. Aborting to avoid overwriting.")
        return
    
    with open(ENV_FILE_PATH, "w") as f:
        for key, value in env_defaults.items():
            f.write(f"{key}={value}\n")

    print(f"{ENV_FILE_PATH} created successfully with a random SECRET_KEY.")

if __name__ == "__main__":
    create_env_file()